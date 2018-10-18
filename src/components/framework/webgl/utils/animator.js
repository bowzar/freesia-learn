export default class Animator {

    source = null;
    sourceBackup = null;
    timeStart = null;
    duration = null;
    easingCallback = null;
    isBusy = false;
    onUpdateCallback = null;

    constructor(source) {
        this.source = source;
    }

    easing(func) {

        this.easingCallback = func;
        return this;
    }

    onUpdate(func) {

        this.onUpdateCallback = func;
        return this;
    }

    to(target, duration) {

        this.isBusy = true;

        this.target = target;
        this.timeStart = new Date().getTime() - 13;
        this.duration = duration;

        this.sourceBackup = {};
        for (let key in this.target) {
            this.sourceBackup[key] = this.source[key];
        }

        this.update();
        return this;
    }

    update() {

        if (!this.isBusy)
            return;

        let now = new Date().getTime();
        let diff = now - this.timeStart;
        let rate = diff / this.duration;
        let completed = false;

        if (rate > 1) {
            rate = 1;
            completed = true;
        }

        rate = this.easingCallback(rate);

        let e = {};

        for (let key in this.target) {

            let from = this.sourceBackup[key];
            let d = this.target[key] - from;
            d *= rate;

            let current = this.source[key];
            let next = from + d;
            this.source[key] = next;

            e[key] = next - current;
        }

        this.onUpdateCallback(e);

        this.isBusy = !completed;

        return this;
    }


    static Easing = {
        Linear: {

            None: function (k) {

                return k;

            }

        },

        Quadratic: {

            In: function (k) {

                return k * k;

            },

            Out: function (k) {

                return k * (2 - k);

            },

            InOut: function (k) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k;
                }

                return - 0.5 * (--k * (k - 2) - 1);

            }

        },

        Cubic: {

            In: function (k) {

                return k * k * k;

            },

            Out: function (k) {

                return --k * k * k + 1;

            },

            InOut: function (k) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }

                return 0.5 * ((k -= 2) * k * k + 2);

            }

        },

        Quartic: {

            In: function (k) {

                return k * k * k * k;

            },

            Out: function (k) {

                return 1 - (--k * k * k * k);

            },

            InOut: function (k) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }

                return - 0.5 * ((k -= 2) * k * k * k - 2);

            }

        },

        Quintic: {

            In: function (k) {

                return k * k * k * k * k;

            },

            Out: function (k) {

                return --k * k * k * k * k + 1;

            },

            InOut: function (k) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }

                return 0.5 * ((k -= 2) * k * k * k * k + 2);

            }

        },

        Sinusoidal: {

            In: function (k) {

                return 1 - Math.cos(k * Math.PI / 2);

            },

            Out: function (k) {

                return Math.sin(k * Math.PI / 2);

            },

            InOut: function (k) {

                return 0.5 * (1 - Math.cos(Math.PI * k));

            }

        },

        Exponential: {

            In: function (k) {

                return k === 0 ? 0 : Math.pow(1024, k - 1);

            },

            Out: function (k) {

                return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

            },

            InOut: function (k) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                if ((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }

                return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

            }

        },

        Circular: {

            In: function (k) {

                return 1 - Math.sqrt(1 - k * k);

            },

            Out: function (k) {

                return Math.sqrt(1 - (--k * k));

            },

            InOut: function (k) {

                if ((k *= 2) < 1) {
                    return - 0.5 * (Math.sqrt(1 - k * k) - 1);
                }

                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

            }

        },

        Elastic: {

            In: function (k) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

            },

            Out: function (k) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

            },

            InOut: function (k) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                k *= 2;

                if (k < 1) {
                    return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
                }

                return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

            }

        },

        Back: {

            In: function (k) {

                var s = 1.70158;

                return k * k * ((s + 1) * k - s);

            },

            Out: function (k) {

                var s = 1.70158;

                return --k * k * ((s + 1) * k + s) + 1;

            },

            InOut: function (k) {

                var s = 1.70158 * 1.525;

                if ((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }

                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

            }

        },

        Bounce: {

            In: function (k) {

                return 1 - Animator.Easing.Bounce.Out(1 - k);

            },

            Out: function (k) {

                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }

            },

            InOut: function (k) {

                if (k < 0.5) {
                    return Animator.Easing.Bounce.In(k * 2) * 0.5;
                }

                return Animator.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

            }

        }
    }
}