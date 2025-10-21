class Needle {
    constructor(element, cdnUrl) {
        this.creative = document.querySelector(element);
        this.defaultConfig = {
            aspect: "4/3",
            title: "Живое голосование",
            question: "",
            answerLeft: "",
            answerRight: "",
            popupText: "",
            logoImage: "",
            labelImage: "",
            logoLink: "",
            landingLink: "",
            clickSound: `${cdnUrl}/audio/click.mp3`,
            percentColor: "#000000",
            segmentStartColor: "#ffffff",
            segmentEndColor: "#000000",
            segmentsStaticValues: [0, 0, 0, 0, 0],
            iframes: {
                left: "",
                right: "",
                center: ""
            },
            iframesLinks: {
                left: "",
                right: "",
                center: ""
            },
            trakings: {
                onLoad: [],
                onViewArea: [],
                onVote: {
                  left: [],
                  right: [],
                  center: []
                },
                onShowPromo: []
            },
            cdnUrl: cdnUrl,
            apiUrl: "https://self-service.programmatica.com/onion"    
        };
    }

    initWidget(config = {}) {
        this.config = Object.assign(this.defaultConfig, config);

        this.createWidget();

        this.creative.style.userSelect = "none";
        this.dial = this.creative.querySelector(".creative-taxo_arc");
        this.needle = this.creative.querySelector(".creative-taxo_needle");
        this.infoBtn = this.creative.querySelector(".creative-footer_advertising");
        this.arrows = this.creative.querySelector(".creative-taxo_arrows");
        this.touchpad = this.creative.querySelector(".creative-taxo_touchpad");
        this.arcThumb = this.creative.querySelector(".creative-taxo_thumb");
        this.thumb = this.creative.querySelector(".creative-taxo_thumb-element");
        this.arcLabel = this.creative.querySelector(".creative-taxo_label");
        this.segments = this.creative.querySelector(".creative-taxo_segments");

        this.dragging = false;
        this.side = null;
        this.canMove = true;
        this.percent = 0;
        this.touchMoved = false;
        this.selectedSegment = 0;
        this.votes = [0, 0, 0, 0, 0];
        this.segmentsValues = [0, 0, 0, 0, 0];
        this.viewAreaTriggered = false;

        if (this.config.clickSound) {
            this.clickSound = new Audio();
            this.clickSound.src = this.config.clickSound;
        }

        this.infoPopupListener();
        this.listener();

        if (this.config.aspect == "16/9") {
            this.creative.classList.add("aspect169");
        } else if (this.config.aspect == "4/3") {
            this.creative.classList.add("aspect43");
        }

        this.insertPixel(this.config.trakings.onLoad);

        this.onResize = this.onResize.bind(this);

        window.addEventListener("resize", this.onResize);

        this.onResize();
        this.getSegmentsValues().then(() => {
            this.observeViewArea();
        });
    }

    observeViewArea() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.viewAreaTriggered) {
                    this.viewAreaTriggered = true;
                    this.insertPixel(this.config.trakings.onViewArea);
                    observer.unobserve(this.creative);
                }
            });
        }, {
            threshold: 0.2
        });

        observer.observe(this.creative);
    }

    async getSegmentsValues() {
        let votesQuantity = 0;
        await this.getVotes();

        this.votes.forEach((item) => {
            votesQuantity += item;
        });

        console.log(this.votes, votesQuantity);
        
        if (votesQuantity >= 1000) {
            this.votes.forEach((item, index) => {
                this.segmentsValues[index] =  Math.round((item * 100) / votesQuantity);
            });
        } else {
            this.segmentsValues = this.config.segmentsStaticValues
        }
    }

    async getVotes() {
        try {
            const response = await fetch(`${this.config.apiUrl}?id=${this.config.id}`);
            if (!response.ok) {
                throw new Error('Request error: ' + response.status);
            }
            const data = await response.json();
            Object.entries(data).forEach((item) => {
                this.votes[item[0] - 1] = item[1];
            });
            return this.votes;
        } catch (error) {
            console.error('Error:', error);
            return this.votes;
        }
    }

    saveVote() {
        fetch(`${this.config.apiUrl}?id=${this.config.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sector: this.selectedSegment })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Request error: ' + response.status);
            }
        })
        .then(data => {})
        .catch(error => {
            console.error('Error:', error);
        });
    }

    onResize() {
        this.containerQueries(".creative-header_pulse", "font-size", 12, 4, 40);
        this.containerQueries(".creative-header_pulse .pulse-icon", "width", 25, 10, 73);
        this.containerQueries(".creative-header_question", "font-size", 11, 5, 50);
        this.containerQueries(".creative-header_question.percent", "font-size", 20, 5, 60);

        if (this.config.aspect == "4/3") {
            this.containerQueries(".creative-tile", "padding-inline", 12, 5.2, 65);
            this.containerQueries(".creative-tile", "padding-top", 10, 3.5, 50);
            this.containerQueries(".creative-tile", "padding-bottom", 3, 2, 20);
            this.containerQueries(".creative-taxo", "margin-top", 5, 1, 75);
            this.containerQueries(".creative-taxo_arc", "max-width", 165, 57, 750);
            this.containerQueries(".creative-taxo_arc", "margin-bottom", 2, 1, 30);
            this.containerQueries(".creative-answers", "margin-top", 2, 1, 30);
            this.containerQueries(".creative-answers", "margin-bottom", 5, 3, 50);
            this.containerQueries(".creative-answers_left", "font-size", 11, 3.5, 40);
            this.containerQueries(".creative-answers_right", "font-size", 11, 3.5, 40);
            this.containerQueries(".creative-logo", "margin-bottom", 2, 1.5, 50);
            this.containerQueries(".creative-logo_link", "max-width", 68, 20, 252);
            this.containerQueries(".creative-footer", "padding-top", 6, 2, 22);
            this.containerQueries(".creative-footer_programmatica", "width", 175, 42, 485);
            this.containerQueries(".creative-footer_advertising span", "font-size", 12, 2.2, 25);
            this.containerQueries(".creative-footer_advertising .btn-info", "width", 15, 3, 32);
        }

        if (this.config.aspect == "16/9") {
            this.containerQueries(".creative-tile", "padding-inline", 12, 5.2, 65);
            this.containerQueries(".creative-tile", "padding-top", 2, 0.5, 50);
            this.containerQueries(".creative-tile", "padding-bottom", 3, 2, 20);
            this.containerQueries(".creative-taxo", "margin-top", 5, 1, 75);
            this.containerQueries(".creative-taxo_arc", "max-width", 130, 46, 950);
            this.containerQueries(".creative-taxo_arc", "margin-bottom", 2, 1, 30);
            this.containerQueries(".creative-answers", "margin-top", 2, 1, 30);
            this.containerQueries(".creative-answers", "margin-bottom", 2, 1.2, 50);
            this.containerQueries(".creative-answers_left", "font-size", 8, 2.5, 40);
            this.containerQueries(".creative-answers_right", "font-size", 8, 2.5, 40);
            this.containerQueries(".creative-logo", "margin-bottom", 2, 1, 50);
            this.containerQueries(".creative-logo_link", "max-width", 45, 15, 252);
            this.containerQueries(".creative-footer", "padding-top", 2, 1, 22);
            this.containerQueries(".creative-footer_programmatica", "width", 150, 42, 485);
            this.containerQueries(".creative-footer_advertising span", "font-size", 9, 1.5, 25);
            this.containerQueries(".creative-footer_advertising .btn-info", "width", 10, 2, 32);
        }
    }
    
    containerQueries(element, styling, min, cqw, max) {
        const eles = this.creative.querySelectorAll(element);
        const width = this.creative.querySelector(".creative-tile").offsetWidth;
        let value = Math.max(min, Math.min((width / 100) * cqw, max));
        let maxContWidth;
        
        if (this.config.aspect == "4/3") {
            maxContWidth = 1280;
        }

        if (this.config.aspect == "16/9") {
            maxContWidth = 1920;
        }

        if (width <= 280) {
            value = min;
        }

        if (width >= maxContWidth) {
            value = max;
        }

        eles.forEach((ele) => {
            ele.style.setProperty(styling, value + "px");
        });
    }

    infoPopupListener() {
        this.infoBtn.addEventListener("click", (e) => {
            this.openPopup();
        });
    }

    openPopup() {
        this.createPopup();
        this.infoPopup = document.getElementById("infoPopup");
        this.infoClose = this.infoPopup.querySelector(".infoClose");
        this.infoPopup.classList.add("show");

        this.infoClose.addEventListener("click", (e) => {
            this.infoPopup.classList.remove("show");
            this.removePopup();
        });
    }

    removePopup() {
        this.infoPopup && this.infoPopup.remove();
    }

    // Прослушивание событий
    listener() {
        this.thumb.addEventListener(
            "touchstart",
            (e) => {
                this.dragging = true;
            },
            { passive: false }
        );

        this.thumb.addEventListener(
            "touchmove",
            (e) => {
                if (!this.dragging) return;
                const touch = e.touches[0];
                if (this.dragging && this.canMove) {
                    this.rotatePin(touch);
                    this.touchMoved = true;
                }
                e.preventDefault();
            },
            { passive: false }
        );

        this.thumb.addEventListener("touchend", (e) => {
            if (this.canMove && this.dragging && this.touchMoved) {
                this.clickSound ? this.clickSound.play() : "";
                this.animeStart();

                setTimeout(() => {
                    this.animeEnd();
                }, 0);
            }
            this.dragging = false;
        });

        window.addEventListener("mouseup", (event) => {
            if (event.target != this.arcLabel) {
                if (this.canMove && this.dragging) {
                    this.clickSound ? this.clickSound.play() : "";
                    this.animeStart();

                    setTimeout(() => {
                        this.animeEnd();
                    }, 0);
                }
                this.dragging = false;
            }
        });

        window.addEventListener("mousemove", (event) => {
            if (event.target != this.arcLabel) {
                if (this.dragging && this.canMove) {
                    this.rotatePin(event);
                }
            }
        });

        this.thumb.addEventListener("mousedown", (event) => {
            if (event.target != this.arcLabel) {
                this.dragging = true;
            }
        });

        this.dial.addEventListener("click", (event) => {
            if (event.target != this.arcLabel) {
                if (this.canMove) {
                    this.clickSound ? this.clickSound.play() : "";
                    this.animeStart();
                    this.rotatePin(event);

                    setTimeout(() => {
                        this.animeEnd();
                    }, 0);
                }
            }
        });
    }

    // Начало энерционной анимации
    animeStart() {
        if (this.canMove) {
            this.needle.classList.remove("swingingLeft");
            this.needle.classList.remove("swingingRight");
        }
    }

    // Конец энерционной анимации
    animeEnd() {
        this.rotateNeedle(this.angle);
        if (this.canMove) {
            this.arcThumb.classList.add("hide");
            this.segments.classList.add("show");
            this.arrows.classList.add("hide");

            setTimeout(() => {
                switch (this.side) {
                    case "left":
                        this.insertPixel(this.config.trakings.onVote.left);
                        this.needle.classList.add("forwardLeft");
                        break;
                    case "right":
                        this.insertPixel(this.config.trakings.onVote.right);
                        this.needle.classList.add("forwardRight");
                        break;
                    case "center":
                        this.insertPixel(this.config.trakings.onVote.center);
                        break;
                }
                this.canMove = false;

                this.showPercentText();
            }, 250);

            setTimeout(() => {
                this.needle.classList.remove("forwardLeft");
                this.needle.classList.remove("forwardRight");
            }, 1250);
        }
        clearTimeout(this.viTimer);
        this.viTimer = setTimeout(() => {
            this.openIframe();
        }, 3000);
    }

    // Показываем выбранные проценты в тексте
    showPercentText() {
        if (this.selectedSegment != 0) {
            const text = this.creative.querySelector(".creative-header_question p");

            clearTimeout(this.txtTimer);
            text.classList.add("hide-show");
            this.txtTimer = setTimeout(() => {
                text.classList.remove("hide-show");
            }, 750);

            text.innerHTML = `<span class="percent" style="color:${this.config.percentColor};">${this.segmentsValues[this.selectedSegment - 1]}%</span> пользователей думают так же`;
        }
    }

    // Получаем угол при перетаскивании пина
    getAngleFromEvent(event, elem) {
        const rect = elem.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.bottom;

        let dx = event.clientX - cx;
        let dy = event.clientY - cy;

        let angleRad = Math.atan2(-dy, dx);
        if (dx < 0 && angleRad < 0) {
            angleRad = Math.PI;
        }
        let angleDeg = angleRad * (180 / Math.PI);

        return Math.max(12, Math.min(168, angleDeg));
    }

    // Вращаем уазатель
    rotateNeedle(angle) {
        if (angle > 144 && angle <= 180) {
            this.selectedSegment = 1;
            this.side = 'left';
        }

        if (angle > 111 && angle <= 144) {
            this.selectedSegment = 2;
            this.side = 'left';
        }

        if (angle > 69 && angle <= 111) {
            this.selectedSegment = 3;
            this.side = 'center';
        }

        if (angle > 36 && angle <= 69) {
            this.selectedSegment = 4;
            this.side = 'right';
        }

        if (angle > 0 && angle <= 36) {
            this.selectedSegment = 5;
            this.side = 'right';
        }

        this.showSegments();
        this.saveVote(); 

        this.needle.style.setProperty("--base-angle", `${90 - angle}deg`);
    }

    // Вращаем бегунок
    rotatePin(event) {
        const angle = this.getAngleFromEvent(event, this.dial);
        this.arcThumb.style.setProperty("--thumb-angle", `${(90 - angle) * 1.1}deg`);
        this.angle = angle;
    }

    insertPixel(pixels) {
        pixels.forEach(pixel => {
            this.creative.querySelector('.pixels').innerHTML += pixel;
        });
    }

    openIframe() {
        this.createIframe();
        this.iframe = document.querySelector(".iframe-promo");

        this.insertPixel(this.config.trakings.onShowPromo);

        this.iframe.querySelector(".iframe-promo_close-button").addEventListener("click", () => {
            this.removeIframe();
        });
    }

    createIframe() {
        if (!document.querySelector(".iframe-promo_container")) {
            this.creative.querySelector(".creative-tile").insertAdjacentHTML("beforeend", `
                <div class="iframe-promo">
                    <div class="iframe-promo_container">
		                ${this.config.iframes[this.side]}
                    </div>
		            <a href="${this.config.iframesLinks[this.side]}" target="_blank" class="iframe-promo_link_layer"></a>
		            <div class="iframe-promo_blacklay"></div>
		        	<button class="iframe-promo_close-button">
		        		<svg fill="#000000" width="64px" height="64px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
		        			<g id="SVGRepo_bgCarrier" stroke-width="0"/>
		        			<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
		        			<g id="SVGRepo_iconCarrier"> <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"/> </g>
		        		</svg>
		        	</button>
		        </div>    
            `);
        }
    }

    removeIframe() {
        this.iframe && this.iframe.remove();
    }

    createWidget() {
        this.creative.insertAdjacentHTML("beforeend", `
		    <div class="creative-tile">
                <div class="creative-header-out">
		            <div class="creative-header">
		    	        <div class="creative-header_pulse">
                            <span>${this.config.title}</span>
                            <span class="pulse-icon"></span>
                        </div>
		    	        <div class="creative-header_question">
		    		        <p>${this.config.question}</p>
		    	        </div>
		            </div>
		        </div>
		        <div class='flex-box'>
		            <div class="creative-taxo">
		        	    <div class="creative-taxo_arc">
		        		    <div class="creative-taxo_circle"></div>
		        		    <div class="creative-taxo_touchpad"></div>
		        		    <div class="creative-taxo_arrows"></div>
		        		    <div class="creative-taxo_needle swingingLeft"></div>
		        		    <a href="${this.config.landingLink}" target="_blank" class="creative-taxo_label" style="background-image: url(${this.config.labelImage})"></a>
		        		    <div class="creative-taxo_segments">
                                <img class="img-responsive" src=""/>
		        		    </div>
		            		<div class="creative-taxo_thumb-parent">
		            		    <div class="creative-taxo_thumb" style="background-image: url(${this.createThumb()})">
		            		        <span class="creative-taxo_thumb-element"></span>
		            		    </div>
		            		</div>
		            	</div>
		            </div>
		            <div class="creative-answers">
		            	<div class="creative-answers_left">
		            		<p>${this.config.answerLeft}</p>
		            	</div>
		            	<div class="creative-answers_right">
		            		<p>${this.config.answerRight}</p>
		            	</div>
		            </div>
		            <div>
		                <div class="creative-logo">
		                	<a target="_blank" href="${this.config.logoLink}" class="creative-logo_link">
                                <img class="creative-logo_image" src="${this.config.logoImage}">
                            </a>
		                </div>
		                <div class="creative-footer">
		                	<a target="_blank" href="https://programmatica.com/" class="creative-footer_programmatica">
		                		<img class="img-responsive" src="${this.config.cdnUrl}/images/programmatica.svg" alt="Логотип programmatica">
		                	</a>
		                	<button class="creative-footer_advertising">
		                		<span class="btn-info">!</span>
		                		<span>Реклама</span>
		                	</button>
		                </div>
		            </div>
		        </div>
		    </div>
            <div class="pixels"></div>
            <div class="temp-svg"></div>`
        );
    }

    hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    interpolateColor(value) {
        const startColor = this.hexToRgb(this.config.segmentStartColor);
        const endColor = this.hexToRgb(this.config.segmentEndColor);
        const ratio = value / (Math.max(...this.segmentsValues) - Math.min(...this.segmentsValues));
        
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    createThumb() {
        const thumb = `<svg width="950" height="834" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#a)">
                <path
                    d="M547.812 105.734c3.031-15.246-6.867-30.166-22.288-32.13a404.13 404.13 0 0 0-114.335 1.757c-15.354 2.435-24.789 17.652-21.291 32.799 3.498 15.146 18.606 24.469 33.985 22.207a347.839 347.839 0 0 1 90.642-1.392c15.442 1.789 30.256-7.994 33.287-23.241Z"
                    fill="url(#b)" />
            </g>
            <defs>
                <linearGradient id="b" x1="453.942" y1="57.875" x2="458.65" y2="190.8" gradientUnits="userSpaceOnUse">
                    <stop stop-color="${this.config.segmentEndColor}" />
                    <stop offset="1" stop-color="${this.config.segmentStartColor}" />
                </linearGradient>
            </defs>
        </svg>`

        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(thumb)));
    }

    showSegments() {
        const segmentsPaths = [
            "M136.057 502.616c-3.179 0-5.771-2.623-5.708-5.832 1.147-58.091 16.322-115.309 44.132-166.407 1.522-2.795 5.036-3.726 7.78-2.102l105.151 62.232c2.715 1.607 3.65 5.11 2.176 7.893-15.766 29.769-25.253 64.903-26.331 98.523-.101 3.155-2.617 5.694-5.743 5.694l-121.457-.001Z",
            "M329.307 190.936c-1.323-2.969-4.794-4.256-7.65-2.793-55.826 28.592-103.384 72.08-137.483 125.722-1.714 2.696-.87 6.292 1.831 7.973l103.841 64.637c2.666 1.659 6.137.825 7.856-1.819 19.994-30.753 47.415-55.81 79.485-72.633 2.736-1.435 3.934-4.789 2.661-7.647l-50.541-113.44Z",
            "M595.682 188.365c1.247-2.942-.147-6.339-3.121-7.498-80.834-31.499-170.901-31.527-251.956-.077-2.975 1.155-4.385 4.542-3.159 7.484l47.692 114.456c1.21 2.903 4.533 4.278 7.48 3.17 47.411-17.821 99.783-17.802 147.067.051 2.938 1.109 6.262-.255 7.49-3.15l48.507-114.436Z",
            "M745.679 320.829c2.709-1.688 3.514-5.313 1.737-8.008-34.555-52.405-82.424-94.781-138.46-122.568-2.847-1.412-6.25-.15-7.558 2.758l-50.677 112.635c-1.296 2.882-.044 6.293 2.762 7.721 32.132 16.36 59.679 40.757 79.898 70.764 1.756 2.606 5.213 3.42 7.85 1.777l104.448-65.079Z",
            "M793.99 502.616a5.721 5.721 0 0 0 5.708-5.832c-1.147-58.091-16.321-115.309-44.132-166.407-1.521-2.795-5.036-3.726-7.78-2.102l-105.15 62.232c-2.716 1.607-3.65 5.11-2.18 7.896 15.708 29.768 24.653 64.899 25.673 98.519.095 3.155 2.611 5.693 5.737 5.693l122.124.001Z",
        ];
        const segmentsPathsActive = [
            "M.4 502.617c-3.03 0-5.556-2.367-5.686-5.424-3.267-77.073 24.784-190.51 64.243-241.419 1.72-2.219 4.81-2.689 7.212-1.214l221.368 135.916c2.658 1.632 3.552 5.093 2.093 7.844-15.791 29.786-25.295 64.953-26.373 98.604-.102 3.155-2.617 5.693-5.743 5.693H.399Z",
            "M281.161 59.593c-1.231-3.05-4.717-4.45-7.645-3.046-87.87 42.145-160.778 103.784-210.72 188.475-1.613 2.735-.692 6.283 2.024 7.897l224.968 133.713c2.659 1.58 6.062.725 7.754-1.881 20.036-30.853 47.543-55.98 79.721-72.821 2.667-1.396 3.886-4.623 2.745-7.451L281.161 59.593Z",
            "M656.058 63.25c1.258-2.755.163-6.015-2.529-7.402-113.988-58.734-266.246-60.83-378.584-.063-2.637 1.427-1.265 4.747 0 7.466l109.373 240.057c1.286 2.762 4.504 4.029 7.36 2.969 47.525-17.633 100.055-17.623 147.458.029 2.874 1.07 6.114-.217 7.387-3.007L656.058 63.251Z",
            "M868.107 252.882c2.715-1.6 3.635-5.057 2.054-7.736C820.776 161.472 765.912 108.877 662.5 58.647c-2.967-1.44-6.591-.112-7.887 2.904l-105.29 244.845c-1.213 2.822.049 6.061 2.818 7.42 32.993 16.19 61.092 40.601 81.443 70.752 1.731 2.566 5.206 3.385 7.907 1.794l226.616-133.48Z",
            "M927.764 502.615c2.962 0 5.455-2.268 5.678-5.252 5.449-73.019-14.681-180.167-60.391-245.141-1.703-2.42-4.978-3.016-7.495-1.44L642.444 390.459c-2.628 1.645-3.5 5.084-2.054 7.819 15.748 29.794 24.717 64.977 25.738 98.644.096 3.154 2.612 5.693 5.738 5.693h255.898Z"
        ];
        const segments = document.createElementNS("http://www.w3.org/2000/svg", "svg");  

        segments.setAttribute("width", "950");
        segments.setAttribute("height", "834");
        segments.setAttribute("fill", "none");

        this.segmentsValues.forEach((value, index) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

            this.creative.querySelector(".temp-svg").appendChild(segments);
            segments.appendChild(path);   
            path.setAttribute("fill", this.interpolateColor(value));

            if (index == this.selectedSegment - 1) {
                path.setAttribute("d", segmentsPathsActive[index]);
            } else {
                path.setAttribute("d", segmentsPaths[index]);
                text.setAttribute("font-size", "36px");
                text.setAttribute("font-weight", "600");
                text.setAttribute("font-family", "Inter, system-ui, sans-serif");
                text.setAttribute("fill", "#fff");
                text.textContent = `${value}%`;
                segments.appendChild(text);
    
                switch (index) {
                    case 0:
                        text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2 - text.getBBox().width / 2);
                        text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2 + text.getBBox().height / 2);
                        break;
                    case 1:
                        text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2 - text.getBBox().width / 4);
                        text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2 + text.getBBox().height / 4);
                        break;
                    case 2:
                        text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2 - text.getBBox().width / 2);
                        text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2);
                        break;
                    case 3:
                        text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2 - text.getBBox().width / 2);
                        text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2 + text.getBBox().height / 4);
                        break;
                    case 4:
                        text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2 - text.getBBox().width / 3);
                        text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2 + text.getBBox().height / 2);
                        break;
                }

            }                

            // radialGradient.setAttribute("id", "radialGradient");
            // radialGradient.setAttribute("cx", "100%");
            // radialGradient.setAttribute("cy", "100%");
            // radialGradient.setAttribute("fx", "0%");
            // radialGradient.setAttribute("fy", "0%");
            // radialGradient.setAttribute("r", "100%");
            // radialGradient.setAttribute("gradientUnits", "userSpaceOnUse");
            // radialGradient.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "stop"));
            // radialGradient.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "stop"));

            // if (index == activeSegment - 1) {
            //     path.setAttribute("d", segmentsPathsActive[index]);
            //     path.setAttribute("fill", 'url(#radialGradient)');
            //     radialGradient.firstChild.setAttribute("stop-color", this.config.segmentStartColor);
            //     radialGradient.firstChild.setAttribute("offset", "0");
            //     radialGradient.lastChild.setAttribute("stop-color", this.interpolateColor(value));
            //     radialGradient.lastChild.setAttribute("offset", "1");
            // } else {
            //     path.setAttribute("d", segmentsPaths[index]);
            //     path.setAttribute("fill", this.interpolateColor(value));
            // }

            //segments.appendChild(defs);
            // defs.appendChild(radialGradient);
        });

        this.creative.querySelector('.creative-taxo_segments img').src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(segments))));
    }

    // Создаем информационный контейнер
    createPopup() {
        if (!document.querySelector("#infoPopup")) {
            document.body.insertAdjacentHTML("beforeend", `
		        <div class="info-popup" id="infoPopup">
		        	<div class="info-popup_inner">
		        		<button class="info-popup_close infoClose">
		        			<svg fill="#000000" width="64px" height="64px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
		        				<g id="SVGRepo_bgCarrier" stroke-width="0"/>
		        				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
		        				<g id="SVGRepo_iconCarrier"> <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"/> </g>
		        			</svg>
		        		</button>
		        		<div class="info-popup_content">
		        			<p>${this.config.popupText}</p>
		        		</div>
		        	</div>
		        </div>
		    `);
        }
    }

    // Записываем ГОЛОС в LocalStorage
    createStorage() {
        localStorage.setItem("voice", this.side == "left" ? this.config.answerLeft : this.config.answerRight);
        console.log(localStorage.getItem("voice"), ' - сохранёно в LocalStorage по ключу "voice" !');
    }
}
