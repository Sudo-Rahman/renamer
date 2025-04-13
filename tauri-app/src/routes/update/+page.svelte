<script lang="ts">
    import {window as tauriWindow} from "@tauri-apps/api";
    import {onMount} from "svelte";
    import {relaunch} from "@tauri-apps/plugin-process";
    import {Button} from "$lib/components/ui/button";
    import {listen} from "@tauri-apps/api/event";
    import {ProgressBarStatus} from "@tauri-apps/api/window";
    import {t} from "$lib/translations";

    let progress = $state(0);
    let contentProgress = $state<number | undefined>(undefined);
    let contentLength = $state<number | undefined>(undefined);
    let finished = $state(false);
    let text = $state($t('updater.progress'));

    type ProgressEvent = {
        type: "download" | "finish";
        downloaded?: number;
        total?: number;
    }

    onMount(async () => {

        listen('update_progress', (event : {event : string,payload : ProgressEvent}) => {
            if (event.payload.type === 'download') {
                contentLength = event.payload.total;
                contentProgress = event.payload.downloaded;
                progress = (contentProgress! * 100) / contentLength!;
                tauriWindow.getCurrentWindow().setProgressBar({progress: progress});
            } else if (event.payload.type === 'finish') {
                progress = 100;
                finished = true;
                text = $t('updater.finished');
                tauriWindow.getCurrentWindow().setProgressBar({status: ProgressBarStatus.None});
            }
        });
    });

    async function relaunchApp() {
        await relaunch();
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }

</script>

<div class="cursor-default select-none bg-card gap-10 flex flex-col justify-center items-center w-full h-full mac:rounded-sm linux:rounded-sm p-10"
     data-tauri-drag-region>

    <div class="flex flex-col items-center">
        <span class="text-2xl font-bold">{text}</span>
    </div>

    <div class="flex flex-col items-center">
        <div class="h-[26px] rounded-full border-primary border-2 relative w-52 p-1">
            <div class="h-full bg-primary rounded-full" style="width: {progress}%"></div>
            {#if contentProgress && contentLength}
                <div class="absolute text-xs top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    {formatFileSize(contentProgress)} / {formatFileSize(contentLength)}
                </div>
            {/if}
        </div>
    </div>
    {#if finished}
        <div class="bottom-3">
            <Button onclick={relaunchApp}>
                {$t('updater.relaunch')}
            </Button>
        </div>
    {:else}
        <div class="flex flex-col items-center">
            <span class="text-sm">{$t('updater.not_close')}</span>
        </div>
    {/if}

</div>