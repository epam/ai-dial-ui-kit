import type { FC } from 'react';

interface ExampleComponentProps {
  title: string;
  description: string;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  description,
}) => {
  return (
    <div className="dial">
      <h1 className="dial-p-4">{title}</h1>
      <p className="dial-p-4">{description}</p>
    </div>
  );
};
