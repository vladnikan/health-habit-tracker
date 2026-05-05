import type { FC } from 'react';

type TIllustrationKind =
  | 'error404'
  | 'error500'
  | 'light-bulb'
  | 'user-info'
  | 'school-board';

type TIllustration = {
  kind: TIllustrationKind;
  width: number;
  height: number;
};

const kindToFileMap: Record<TIllustrationKind, string> = {
  error404: '404',
  error500: '500',
  'light-bulb': 'light-bulb',
  'user-info': 'user-info',
  'school-board': 'school-board'
};

export const Illustration: FC<TIllustration> = ({ kind, width, height }) => {
  const fileName = kindToFileMap[kind];

  return (
    <img
      src={`/images/illustrations/${fileName}.svg`}
      alt={`illustration ${kind}`}
      width={width}
      height={height}
    />
  );
};
