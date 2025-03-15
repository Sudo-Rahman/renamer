<script lang="ts">
    import {window as tauriWindow} from "@tauri-apps/api";
    import {onMount} from "svelte";
    import {relaunch} from "@tauri-apps/plugin-process";
    import {Button} from "$lib/components/ui/button";
    import {listen} from "@tauri-apps/api/event";
    import {ProgressBarStatus} from "@tauri-apps/api/window";

    let progress = $state(0);
    let contentLength = $state<number | undefined>(0);
    let finished = $state(false);
    let text = $state('Mise à jour en cours');

    type ProgressEvent = {
        type: "download" | "finish";
        progress?: number;
        contentLength?: number;
    }

    onMount(async () => {

        listen('update_progress', (event : {event : string,payload : ProgressEvent}) => {
            console.log(event);
            if (event.payload.type === 'download') {
                contentLength = event.payload.contentLength;
                progress = (event.payload.progress! * 100) / event.payload.contentLength!;
                tauriWindow.getCurrentWindow().setProgressBar({progress: progress});
            } else if (event.payload.type === 'finish') {
                finished = true;
                text = 'Mise à jour terminée';
                tauriWindow.getCurrentWindow().setProgressBar({status: ProgressBarStatus.None});
            }
        });
    });

    async function relaunchApp() {
        await relaunch();
    }

</script>

<div class=" cursor-default select-none bg-card gap-10 flex flex-col justify-center items-center w-full h-full rounded-md p-10"
     data-tauri-drag-region>

    <div class="flex flex-col items-center">
        <span class="text-2xl font-bold">{text}</span>
    </div>

    <div class="flex flex-col items-center">
        {#if !contentLength}
            <div class="h-[22px] rounded-full border-primary border-2 relative w-52 p-1">
                <div class="h-full bg-primary rounded-full" style="width: {progress}%"></div>
            </div>
        {:else}
            <div class="h-[22px] rounded-full border-primary border-2 relative w-52 p-1">
                <div class="h-full bg-primary rounded-full" style="width: 100%"></div>
            </div>
        {/if}
    </div>
    {#if finished}
        <div class="bottom-3">
            <Button onclick={relaunchApp}>
                Relancer l'application
            </Button>
        </div>
    {:else}
        <div class="flex flex-col items-center">
            <span class="text-sm">Veuillez ne pas fermer l'application</span>
            <span class="text-sm">Cela peut prendre quelques minutes</span>
        </div>
    {/if}

</div>