<script setup lang="ts">
import Page from '@/components/Page.vue'
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {useForm} from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(4).max(32),
    password: z.string().min(6).max(32),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
});
</script>

<template>
  <main>
    <Page title="Sign In" description="Sign in with your username and password.">
      <div>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="mustermann123" v-bind="componentField" />
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="123" type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <Button class="mt-5" type="submit">Sign In</Button>
          <Button variant="secondary" class="mt-5" type="submit">Sign In</Button>
          <Button variant="destructive" class="mt-5" type="submit">Sign In</Button>
        </form>
      </div>
    </Page>
  </main>
</template>

<style scoped></style>
