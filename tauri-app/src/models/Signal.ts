export type Listener<T> = (value: T) => void;

export class Signal<T> {
    private listeners: Listener<T>[] = [];

    public connect(listener: Listener<T>): Listener<T> {
        this.listeners.push(listener);
        return listener;
    }

    public disconnect(listener: Listener<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public disconnectAll(): void {
        this.listeners = [];
    }

    public emit(value: T): void {
        this.listeners.forEach(listener => listener(value));
    }
}