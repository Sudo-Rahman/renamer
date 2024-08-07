import {type FileInfo, stat} from "@tauri-apps/plugin-fs";

export class RenamerFile {
    path: string;
    name: string;
    newname: string;
    children: RenamerFile[];
    parent: RenamerFile | null;
    checked: boolean = true;
    private fileInfo?: FileInfo;

    constructor(path: string) {
        this.path = path;
        this.name = path.split("/").pop() || "";
        this.newname = this.name;
        this.children = [];
        this.parent = null;
    }

    public async getFileInfo(): Promise<FileInfo> {
        if (this.fileInfo) {
            return this.fileInfo;
        }
        this.fileInfo = await stat(this.path);
        return this.fileInfo;
    }

    public getDirectory(): string {
        return this.path.split("/").slice(0, -1).join("/");
    }

    public getFormatedBirthDate(): string {
        if (!this.fileInfo || !this.fileInfo?.birthtime) {
            return "";
        }
        const date = this.fileInfo?.birthtime;

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public getFormatedModDate(): string {
        if (!this.fileInfo || !this.fileInfo?.mtime) {
            return "";
        }
        const date = this.fileInfo?.mtime;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public getFileInfoSync(): FileInfo | undefined {
        return this.fileInfo;
    }

    public getStringSize(): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = this.fileInfo?.size || 0;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
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
