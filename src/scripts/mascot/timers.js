/** A group owns every callback in one animation or conversation. */
export class TimerGroup {
  constructor(clock = globalThis) {
    this.clock = clock;
    this.ids = new Set();
  }
  set(callback, delay) {
    const id = this.clock.setTimeout(() => {
      if (!this.ids.delete(id)) return;
      callback();
    }, delay);
    this.ids.add(id);
    return id;
  }
  clear(id) {
    if (id == null) return;
    this.clock.clearTimeout(id);
    this.ids.delete(id);
  }
  clearAll() {
    for (const id of this.ids) this.clock.clearTimeout(id);
    this.ids.clear();
  }
}
