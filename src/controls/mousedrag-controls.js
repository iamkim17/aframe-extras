/**
 * Mousedown-move-forward controls for mobile.
 */
module.exports = AFRAME.registerComponent('mousedrag-controls', {
    schema: {
        enabled: { default: true },
        reverseEnabled: { default: true }
    },

    init: function () {
        this.dVelocity = new THREE.Vector3();
        this.bindMethods();
        this.directionY = 0;
        this.directionX = 0;
        this.x_cord = 0;
        this.y_cord = 0;
        this.classes = [
            'top',
            'left',
            'right',
            'bottom'
        ]
    },

    play: function () {
        this.addEventListeners();
    },

    pause: function () {
        this.removeEventListeners();
        this.dVelocity.set(0, 0, 0);
    },

    remove: function () {
        this.pause();
    },

    addEventListeners: function () {
        const sceneEl = this.el.sceneEl;
        const canvasEl = sceneEl.canvas;

        if (!canvasEl) {
            sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
            return;
        }

        canvasEl.addEventListener('mousedown', this.onMouseDown);
        canvasEl.addEventListener('mouseup', this.onMouseUp);
    },

    removeEventListeners: function () {
        const canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
        if (!canvasEl) { return; }

        canvasEl.removeEventListener('mousedown', this.onMouseDown);
        canvasEl.removeEventListener('mouseup', this.onMouseUp);
    },

    isVelocityActive: function () {
        return this.data.enabled && !!this.directionY || !!this.directionX;
    },

    getVelocityDelta: function () {
        this.dVelocity.z = this.directionY;
        this.dVelocity.x = this.directionX;
        return this.dVelocity.clone();
    },

    bindMethods: function () {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    },

    onMouseDown: function (e) {
        //this.direction = -1;
        if (this.data.reverseEnabled) {
            //this.direction = 1;
            var x = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
            var y = (e.offsetY != null) ? e.offsetY : e.originalEvent.layerY;
            this.x_cord = x / window.innerWidth;
            this.y_cord = y / window.innerHeight;

            var bl = this.x_cord < this.y_cord;       //  false/true
            var br = this.x_cord > (1 - this.y_cord); //  true\false
            var dir = this.classes[bl * 1 + br * 2];
            var rawDir = bl * 1 + br * 2;
            console.log("DirValue: " + dir + " RawDirValue: " + rawDir);
            //-(e.pageY / window.innerHeight) * 2 + 1;
            //console.log("X value: " + this.x_cord + " Y value: " + this.y_cord);
            if (rawDir == 0) {
                this.directionY = -1;
            }
            else if (rawDir == 3) {
                this.directionY = 1;
            }
            else if (rawDir == 1) {
                this.directionX = -1;
            }
            else if (rawDir == 2) {
                this.directionX = 1;
            }
        }

        e.preventDefault();
    },

    onMouseUp: function (e) {
        this.x_cord = 0;
        this.y_cord = 0;
        this.directionY = 0;
        this.directionX = 0;
        e.preventDefault();
    }
});
