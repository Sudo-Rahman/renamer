import {type FileInfo, stat} from "@tauri-apps/plugin-fs";

export class RenamerFile {
    path: string;
    name: string;
    children: RenamerFile[];
    parent: RenamerFile | null;
    private fileInfo?: FileInfo;

    constructor(path: string) {
        this.path = path;
        this.name = path.split("/").pop() || "";
        this.children = [];
        this.parent = null;
    }

    async getFileInfo(): Promise<FileInfo> {
        if (this.fileInfo) {
            return this.fileInfo;
        }
        this.fileInfo = await stat(this.path);
        return this.fileInfo;
    }

    public getExtension(): string {
        return this.name.split(".").pop() || "";
    }

    public addChild(child: RenamerFile): void {
        this.children.push(child);
        child.parent = this;
    }

    public removeChild(child: RenamerFile): void {
        this.children = this.children.filter((c) => c !== child);
        child.parent = null;
    }

    public getFullPath(): string {
        return this.parent ? `${this.parent.getFullPath()}/${this.name}` : this.name;
    }

}
