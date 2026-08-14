<template>
  <div class="transform-playground">
    <div class="transform-panel">
      <div class="transform-panel__header">
        <div>
          <h3>Transform Controls</h3>
          <p>Preview how the example behaves when its container is transformed.</p>
        </div>
        <button type="button" class="transform-panel__reset" @click="reset">
          Reset
        </button>
      </div>

      <div class="transform-panel__mode">
        <label class="transform-panel__toggle">
          <input v-model="isEnabled" type="checkbox">
          <span>Enable transform</span>
        </label>
        <button
          type="button"
          class="transform-panel__mode-button"
          :class="{ active: mode === 'guided' }"
          @click="mode = 'guided'"
        >
          Guided
        </button>
        <button
          type="button"
          class="transform-panel__mode-button"
          :class="{ active: mode === 'custom' }"
          @click="mode = 'custom'"
        >
          Custom
        </button>
      </div>

      <div v-if="mode === 'guided'" class="transform-grid">
        <label class="transform-field">
          <span>Translate X</span>
          <input v-model.number="translateX" type="number" step="5">
          <small>px</small>
        </label>
        <label class="transform-field">
          <span>Translate Y</span>
          <input v-model.number="translateY" type="number" step="5">
          <small>px</small>
        </label>
        <label class="transform-field">
          <span>Scale X</span>
          <input v-model.number="scaleX" type="number" step="0.1">
          <small>ratio</small>
        </label>
        <label class="transform-field">
          <span>Scale Y</span>
          <input v-model.number="scaleY" type="number" step="0.1">
          <small>ratio</small>
        </label>
        <label class="transform-field">
          <span>Rotate</span>
          <input v-model.number="rotate" type="number" step="1">
          <small>deg</small>
        </label>
        <label class="transform-field">
          <span>Skew X</span>
          <input v-model.number="skewX" type="number" step="1">
          <small>deg</small>
        </label>
        <label class="transform-field">
          <span>Skew Y</span>
          <input v-model.number="skewY" type="number" step="1">
          <small>deg</small>
        </label>
        <label class="transform-field">
          <span>Origin X</span>
          <input v-model.trim="originX" type="text" placeholder="50%">
          <small>%, px, left</small>
        </label>
        <label class="transform-field">
          <span>Origin Y</span>
          <input v-model.trim="originY" type="text" placeholder="0%">
          <small>%, px, top</small>
        </label>
      </div>

      <label v-else class="transform-field transform-field--wide">
        <span>Custom transform</span>
        <textarea
          v-model.trim="customTransform"
          rows="3"
          placeholder="perspective(800px) rotateX(18deg) translate3d(40px, 0, 60px)"
        />
        <small>Enter any valid CSS transform string, including matrix or matrix3d.</small>
      </label>

      <div class="transform-panel__output">
        <strong>transform:</strong>
        <code>{{ appliedTransformValue }}</code>
      </div>
      <div class="transform-panel__output">
        <strong>transform-origin:</strong>
        <code>{{ appliedTransformOriginValue }}</code>
      </div>
    </div>

    <div class="transform-stage-shell">
      <div
        class="transform-stage"
        :class="{ 'transform-stage--enabled': isEnabled }"
        :style="stageStyle"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
const createGuidedDefaults = () => ({
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  skewX: 0,
  skewY: 0,
  originX: '50%',
  originY: '0%'
});

export default {
  name: 'TransformPlayground',
  data() {
    const guidedDefaults = createGuidedDefaults();

    return {
      isEnabled: true,
      mode: 'guided',
      translateX: guidedDefaults.translateX,
      translateY: guidedDefaults.translateY,
      scaleX: guidedDefaults.scaleX,
      scaleY: guidedDefaults.scaleY,
      rotate: guidedDefaults.rotate,
      skewX: guidedDefaults.skewX,
      skewY: guidedDefaults.skewY,
      originX: guidedDefaults.originX,
      originY: guidedDefaults.originY,
      customTransform: ''
    };
  },
  computed: {
    transformValue() {
      if (this.mode === 'custom') {
        return this.customTransform || 'none';
      }

      const transformParts = [];
      const translateX = this.normalizeNumber(this.translateX, 0);
      const translateY = this.normalizeNumber(this.translateY, 0);
      const scaleX = this.normalizeNumber(this.scaleX, 1);
      const scaleY = this.normalizeNumber(this.scaleY, 1);
      const rotate = this.normalizeNumber(this.rotate, 0);
      const skewX = this.normalizeNumber(this.skewX, 0);
      const skewY = this.normalizeNumber(this.skewY, 0);

      if (translateX !== 0 || translateY !== 0) {
        transformParts.push(`translate(${translateX}px, ${translateY}px)`);
      }

      if (scaleX !== 1 || scaleY !== 1) {
        transformParts.push(`scale(${scaleX}, ${scaleY})`);
      }

      if (rotate !== 0) {
        transformParts.push(`rotate(${rotate}deg)`);
      }

      if (skewX !== 0) {
        transformParts.push(`skewX(${skewX}deg)`);
      }

      if (skewY !== 0) {
        transformParts.push(`skewY(${skewY}deg)`);
      }

      return transformParts.length ? transformParts.join(' ') : 'none';
    },
    transformOriginValue() {
      return `${this.originX || '50%'} ${this.originY || '0%'}`;
    },
    appliedTransformValue() {
      return this.isEnabled ? this.transformValue : '';
    },
    appliedTransformOriginValue() {
      return this.isEnabled ? this.transformOriginValue : 'initial';
    },
    stageStyle() {
      return {
        transform: this.appliedTransformValue,
        transformOrigin: this.isEnabled ? this.transformOriginValue : ''
      };
    }
  },
  methods: {
    normalizeNumber(value, fallback) {
      return Number.isFinite(value) ? value : fallback;
    },
    reset() {
      const guidedDefaults = createGuidedDefaults();

      this.isEnabled = true;
      this.mode = 'guided';
      this.translateX = guidedDefaults.translateX;
      this.translateY = guidedDefaults.translateY;
      this.scaleX = guidedDefaults.scaleX;
      this.scaleY = guidedDefaults.scaleY;
      this.rotate = guidedDefaults.rotate;
      this.skewX = guidedDefaults.skewX;
      this.skewY = guidedDefaults.skewY;
      this.originX = guidedDefaults.originX;
      this.originY = guidedDefaults.originY;
      this.customTransform = '';
    }
  }
};
</script>

<style scoped>
.transform-playground {
  min-height: 100%;
  box-sizing: border-box;
}

.transform-panel {
  background: #ffffff;
  border: 1px solid rgba(59, 130, 246, 0.18);
  border-radius: 16px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  margin: 0 auto 24px;
  max-width: 1280px;
  padding: 20px 22px;
}

.transform-panel__header {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 18px;
}

.transform-panel__header h3 {
  color: #0f172a;
  font-size: 18px;
  margin: 0 0 6px;
}

.transform-panel__header p {
  color: #475569;
  margin: 0;
}

.transform-panel__reset,
.transform-panel__mode-button {
  appearance: none;
  background: #eff6ff;
  border: 1px solid rgba(59, 130, 246, 0.22);
  border-radius: 999px;
  color: #1d4ed8;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
}

.transform-panel__mode {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.transform-panel__toggle {
  align-items: center;
  color: #0f172a;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  gap: 8px;
  margin-right: 6px;
}

.transform-panel__toggle input {
  accent-color: #2563eb;
}

.transform-panel__mode-button.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.transform-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 18px;
}

.transform-field {
  color: #334155;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  font-weight: 600;
  gap: 8px;
}

.transform-field input,
.transform-field textarea {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  color: #0f172a;
  font: inherit;
  padding: 10px 12px;
}

.transform-field textarea {
  min-height: 88px;
  resize: vertical;
}

.transform-field small {
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
}

.transform-field--wide {
  margin-bottom: 18px;
}

.transform-panel__output {
  background: #0f172a;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 12px;
  margin-top: 10px;
  overflow-wrap: anywhere;
  padding: 12px 14px;
}

.transform-panel__output strong {
  color: #93c5fd;
  margin-right: 6px;
}

.transform-stage-shell {
  margin: 0 auto;
  max-width: 1280px;
  overflow: visible;
  padding: 8px 8px 40px;
}

.transform-stage {
  min-height: 100%;
  transition: transform 180ms ease, transform-origin 180ms ease;
}

.transform-stage--enabled {
  /* transform-style: preserve-3d; */
}

@media (max-width: 768px) {
  .transform-playground {
    padding: 0;
  }

  .transform-panel {
    padding: 16px;
  }

  .transform-panel__header {
    flex-direction: column;
  }

  .transform-panel__reset {
    width: 100%;
  }
}
</style>
