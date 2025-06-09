<script setup lang="ts">
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import type { Game } from '@/model/model.ts'
import { onMounted, ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/Spinner.vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
	onStop?: () => Promise<void>
}>()

const latestGame = ref<Game>()

async function stopGame() {
	if (!latestGame.value) return

	try {
		await fetchRestEndpoint('/games/stop', 'POST')
		latestGame.value = undefined

		if (props.onStop) {
			await props.onStop()
		}
	} catch (error) {
		console.error(error)
	}
}

onMounted(async () => {
	try {
		latestGame.value = await fetchRestEndpoint('/games/current', 'GET');
	}
	catch (error) {
		console.error(error);
	}
})
</script>

<template>
	<Card id="card-current-game">
		<CardHeader>
			<div class="flex items-center gap-4">
				<CardTitle id="title">Current Game</CardTitle>
				<Spinner v-if="latestGame" width="24" />
			</div>
		</CardHeader>
		<CardContent v-if="latestGame">
			<div class="text-center mb-2 font-bold text-3xl">
				{{ latestGame.homeTeamScore }} - {{ latestGame.awayTeamScore }}
			</div>
			<div class="text-center text-lg mb-4">
				{{ latestGame.homeTeam.name }} - {{ latestGame.awayTeam.name }}
			</div>
			<!--<div>
			  {{ latestGame.duration }}
			</div>-->
			<div class="text-end">
				<Button @click="stopGame">Stop</Button>
			</div>
		</CardContent>
		<CardContent v-else>
			<p class="no-games">No current game running.</p>
		</CardContent>
	</Card>
</template>

<style scoped></style>
