<script lang="ts">
    import PricingSection from "$lib/components/pricing/PricingSection.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import WindowsDownload from "$lib/components/download/WindowsDownload.svelte";
    import MacOsDownload from "$lib/components/download/MacOsDownload.svelte";
    import LinuxDownload from "$lib/components/download/LinuxDownload.svelte";
    import {Label} from "$lib/components/ui/label";

</script>


<div class="flex flex-col space-y-32">

    <div class="px-5">
        <PricingSection/>
    </div>


    <div class="bg-card" id="anchor-download">
        <div class="flex p-4 justify-center items-center space-y-4 flex-col">

            <Label class="text-2xl font-semibold text-center">Download Renamer</Label>

            <div class="flex p-10 justify-center bg-background/10 border w-fit items-center rounded-2xl">
                <Tabs.Root class="space-y-10" value="windows">
                    <Tabs.List>
                        <Tabs.Trigger value="windows">Windows</Tabs.Trigger>
                        <Tabs.Trigger value="macos">Macos</Tabs.Trigger>
                        <Tabs.Trigger value="linux">Linux</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="windows">
                        <WindowsDownload/>
                    </Tabs.Content>
                    <Tabs.Content value="macos">
                        <MacOsDownload/>
                    </Tabs.Content>
                    <Tabs.Content value="linux">
                        <LinuxDownload/>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

        </div>
    </div>

</div>