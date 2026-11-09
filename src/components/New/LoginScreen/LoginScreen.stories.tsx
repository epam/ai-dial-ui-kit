import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/New/Button/Button';
import { Notification } from '@/components/New/Notification/Notification';
import { Spinner } from '@/components/Spinner/Spinner';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { NotificationType, NotificationVariant } from '@/types/notification';

import { LoginScreen, type LoginScreenProps } from './LoginScreen';

const providers = [
  {
    id: 'keycloak',
    label: 'Keycloak',
    href: '#keycloak',
    iconSrc: 'https://authjs.dev/img/providers/keycloak.svg',
  },
  {
    id: 'azure-ad',
    label: 'Microsoft Entra ID',
    href: '#azure-ad',
    iconSrc: 'https://authjs.dev/img/providers/azure-ad.svg',
  },
  { id: 'corporate', label: 'Corporate SSO', href: '#corporate' },
];

const meta = {
  title: 'Components_2_0/LoginScreen',
  component: LoginScreen,
  tags: ['auth', 'login', 'sign-in', 'providers', 'page'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The full-page sign-in screen shared by DIAL applications: themed artwork behind a centred card with the product mark, an `h1`, state content and one button per identity provider. The application fetches the providers and builds their URLs. For a signed-out or access-denied state inside an app, use `StateScreen`.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' }, description: 'Headline (`h1`)' },
    description: {
      control: { type: 'text' },
      description: 'Prompt above the provider list',
    },
    logoSrc: { control: { type: 'text' }, description: 'Product mark' },
    providers: { control: false },
    children: { control: false, description: 'State content' },
  },
  args: {
    title: 'Welcome to DIAL Chat',
    description: 'Sign in with:',
    providersLabel: 'Sign-in options',
    providers,
  },
  render: (args) => (
    <div className="h-screen">
      <LoginScreen {...args} />
    </div>
  ),
} satisfies Meta<LoginScreenProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Providers: Story = {};

export const Loading: Story = {
  args: {
    providers: [],
    children: <Spinner ariaLabel="Loading sign-in options…" size={32} />,
  },
};

export const ProvidersFailed: Story = {
  args: {
    providers: [],
    children: (
      <>
        <Notification
          variant={NotificationVariant.Error}
          type={NotificationType.SectionMessage}
          message="Sign-in options could not be loaded."
          className="w-full"
        />
        <Button
          variant={ButtonVariant.Neutral}
          appearance={ButtonAppearance.Outlined}
          label="Try again"
        />
      </>
    ),
  },
};

export const NoProviders: Story = {
  args: {
    providers: [],
    children: (
      <Notification
        variant={NotificationVariant.Warning}
        type={NotificationType.SectionMessage}
        message="No sign-in method is configured. Contact your administrator."
        className="w-full"
      />
    ),
  },
};

export const SignInInterrupted: Story = {
  args: {
    children: (
      <Notification
        variant={NotificationVariant.Info}
        type={NotificationType.SectionMessage}
        message="Sign-in did not complete. Choose a sign-in option to try again."
        className="w-full"
      />
    ),
  },
};
