<script setup lang="ts">
import Page from '@/components/Page.vue'
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {useForm} from 'vee-validate'
import {toTypedSchema} from '@vee-validate/zod'
import * as z from 'zod'
import router from "@/router";
import {useUserStore} from "@/stores/user-store.ts";

export interface UserCredentials {
  username: string;
  password: string;
}

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(4).max(32),
    password: z.string().min(6).max(32),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const userStore = useUserStore();

const onSubmit = form.handleSubmit(async (values) => {
  const user: UserCredentials = values;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      const data = await response.json();
      const jwt = data.accessToken;
      // Save JWT in localStorage or sessionStorage

      const userStore = useUserStore();

      userStore.setAccessToken(jwt);
      userStore.setFirstName(data.user.firstName);
      userStore.setLastName(data.user.lastName);

      //sessionStorage.setItem('jwt', jwt);
      //sessionStorage.setItem('username', user.username);
      await router.push("/");
    } else {
      // Handle unauthorized access
      //errorMessage.style.display = 'block';
    }
  } catch (error) {
    console.error('Login error:', error);
    //errorMessage.style.display = 'block';
  }
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
                <Input placeholder="Username" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <div class="flex flex-row items-center space-x-2 mt-5">
            <Button class="" type="submit">Sign In</Button>
            <img v-if="userStore.isAuthenticated" src="/icons/favicon.svg" alt="spinner"
                 style="width: 2rem; height: 2rem"
                 class="h-4 w-4 animate-spin"/>
          </div>
        </form>
      </div>
    </Page>
  </main>
</template>

<style scoped></style>
