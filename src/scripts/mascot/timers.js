export class TimerGroup {
  constructor() {
    this.ids = new Set();
  }

  set(callback, delay) {
    const id = window.setTimeout(() => {
      this.ids.delete(id);
      callback();
    }, delay);
    this.ids.add(id);
    return id;
  }

  clear(id) {
    if (!id) return;
    window.clearTimeout(id);
    this.ids.delete(id);
  }

  clearAll() {
    for (const id of this.ids) window.clearTimeout(id);
    this.ids.clear();
  }
}
