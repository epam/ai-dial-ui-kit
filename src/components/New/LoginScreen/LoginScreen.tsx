import { useId, useState, type FC, type ReactNode, type Ref } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { NeutralButton } from '@/components/New/Button/ButtonWrappers';

export interface LoginScreenProvider {
  /** Stable provider id; used as the list key. */
  id: string;
  /** Visible label; also the link's accessible name. */
  label: string;
  /** Where the provider's sign-in starts — a top-level navigation. */
  href: string;
  /** Optional provider logo. Decorative; hidden when it fails to load. */
  iconSrc?: string;
}

export interface LoginScreenProps {
  /** Headline of the screen, rendered as the page's `h1`. */
  title: ReactNode;
  /** Prompt above the provider list, such as "Sign in with:". */
  description?: ReactNode;
  /** Product mark above the title. Decorative; hidden when it fails to load. */
  logoSrc?: string;
  /** One full-width link-styled button per provider. */
  providers?: LoginScreenProvider[];
  /** Accessible name of the provider list. */
  providersLabel?: string;
  /** State content above the providers: a spinner, an error with a retry, a notice. */
  children?: ReactNode;
  /** Ref to the `h1` (focusable with `tabIndex={-1}`), for moving focus after a retry. */
  titleRef?: Ref<HTMLHeadingElement>;
  /** Additional CSS classes for the container. */
  className?: string;
}

interface DecorativeImageProps {
  src: string;
  className: string;
}

const DecorativeImage: FC<DecorativeImageProps> = ({ src, className }) => {
  const [failedSrc, setFailedSrc] = useState<string>();

  if (failedSrc === src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
};

/**
 * The full-page sign-in screen shared by DIAL applications: soft themed
 * artwork behind a centred card with the product mark, an `h1`, state content
 * and one button per identity provider.
 * aliases: SignInPage|LoginPage|AuthPage|ProviderPicker
 * Design system 2.0
 *
 * Fills its container. The root is a `section` named by its title. The
 * artwork follows the `gradient-1` / `gradient-2` theme tokens. On mobile the
 * card loses its surface and spans the width. Fetching providers and building
 * their URLs stay with the application. For a signed-out or access-denied
 * state inside an app, use `StateScreen`.
 *
 * @example
 * ```tsx
 * <LoginScreen
 *   logoSrc="/favicon.svg"
 *   title="Welcome to DIAL Chat"
 *   description="Sign in with:"
 *   providersLabel="Sign-in options"
 *   providers={[{ id: 'keycloak', label: 'Keycloak', href: '/api/auth/login/keycloak' }]}
 * />
 * ```
 *
 * @param title - Headline of the screen, rendered as the page's `h1`.
 * @param [description] - Prompt above the provider list.
 * @param [logoSrc] - Product mark above the title.
 * @param [providers] - One link-styled button per provider.
 * @param [providersLabel] - Accessible name of the provider list.
 * @param [children] - State content above the providers.
 * @param [titleRef] - Ref to the focusable `h1`.
 * @param [className] - Additional CSS classes for the container.
 */
export const LoginScreen: FC<LoginScreenProps> = ({
  title,
  description,
  logoSrc,
  providers = [],
  providersLabel,
  children,
  titleRef,
  className,
}) => {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={mergeClasses(
        'relative flex size-full items-center justify-center overflow-hidden bg-layer-sunken mobile:items-start mobile:bg-layer-raised mobile:px-6',
        className,
        DIAL_KIT_CLASS.loginScreen,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -start-1/4 -bottom-1/3 size-[80vmax] rounded-full bg-radial from-gradient-2 to-transparent to-70% opacity-20 blur-3xl" />
        <div className="absolute -end-1/4 -top-1/3 size-[80vmax] rounded-full bg-radial from-gradient-1 to-transparent to-70% opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-6 my-8 flex flex-col items-center gap-12 rounded-xl bg-layer-raised p-16 mobile:mx-0 mobile:mt-10 mobile:w-full mobile:rounded-none mobile:bg-transparent mobile:p-0">
        {logoSrc && (
          <DecorativeImage
            src={logoSrc}
            className="size-8 shrink-0 object-contain"
          />
        )}

        <div className="flex w-full flex-col items-center gap-8 mobile:gap-6">
          <h1
            id={titleId}
            ref={titleRef}
            tabIndex={-1}
            className="dial-display2-text text-center text-primary"
          >
            {title}
          </h1>

          <div className="flex w-full flex-col items-center gap-5 desktop:w-100">
            {children}
            {providers.length > 0 && (
              <>
                {description != null && (
                  <p className="dial-body-text text-center text-primary">
                    {description}
                  </p>
                )}
                <ul
                  aria-label={providersLabel}
                  className="m-0 flex w-full list-none flex-col gap-3 p-0"
                >
                  {providers.map((provider) => (
                    <li key={provider.id}>
                      <NeutralButton
                        href={provider.href}
                        label={provider.label}
                        iconBefore={
                          provider.iconSrc ? (
                            <DecorativeImage
                              src={provider.iconSrc}
                              className="size-5 shrink-0"
                            />
                          ) : undefined
                        }
                        className="w-full"
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
