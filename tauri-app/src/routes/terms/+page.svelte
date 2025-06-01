<script>
    import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "$lib/components/ui/accordion";
    import {Button} from "$lib/components/ui/button/index.js";
    import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "$lib/components/ui/card";
    import {Checkbox} from "$lib/components/ui/checkbox/index";
    import {emit} from "@tauri-apps/api/event";
    import {t} from "$lib/translations";

    let accepted = $state(false);

    const currentDate = new Date('2025/06/01').toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const handleAccept = () => {
        if (accepted) {
            // Logic for acceptance
            emit("terms_accepted");
        }
    };

    let data = $derived($t('terms.sections'));
</script>

<div class="mac:rounded-sm linux:rounded-xl w-full h-full flex ">
    <Card class="h-full flex flex-col w-full gap-2">
        <CardHeader class="flex flex-col items-start justify-start space-y-2" data-tauri-drag-region>
            <CardTitle class="text-2xl font-bold">{$t('terms.title')}</CardTitle>
            <CardDescription>{$t('terms.subtitle')}</CardDescription>
        </CardHeader>

        <CardContent class="flex flex-col h-full overflow-y-scroll ">
            <div>
                <p class="text-sm text-gray-500">{$t('terms.last_update', {date: currentDate})}</p>

                <Accordion class="w-full" type="single">
                    {#each data as item (item.id)}
                        <AccordionItem value={item.id}>
                            <AccordionTrigger class="text-left">{item.title}</AccordionTrigger>
                            <AccordionContent>
                                {#each item.content as content}
                                    <p class="text-justify">{@html content}</p>
                                {/each}
                            </AccordionContent>
                        </AccordionItem>
                    {/each}
                </Accordion>

            </div>
        </CardContent>

        <CardFooter class="flex flex-col items-start space-y-4">
            <div class="flex items-center space-x-2">
                <Checkbox bind:checked={accepted} id="terms"/>
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                       for="terms">
                    {$t('terms.accept_label')}
                </label>
            </div>

            <Button class="w-full sm:w-auto" disabled={!accepted} onclick={handleAccept}>
                {$t('terms.accept_btn')}
            </Button>
        </CardFooter>
    </Card>
</div>
