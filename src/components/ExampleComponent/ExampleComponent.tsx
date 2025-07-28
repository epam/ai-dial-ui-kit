import type { FC } from 'react';
import './ExampleComponent.scss';

export interface ExampleComponentProps {
  title: string;
  description: string;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  description,
}) => {
  return (
    <div className="dial">
      <div className="dial-border-1 dial-border-solid dial-border-gray-300 dial-rounded-lg">
        <h1 className="dial-p-4 example-component">{title}</h1>
        <p className="dial-p-4">{description}</p>
      </div>
    </div>
  );
};
