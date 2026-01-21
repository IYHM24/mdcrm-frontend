import type React from 'react';

export type useStateDefinition<T> = React.Dispatch<React.SetStateAction<T>>;

//React.Dispatch<React.SetStateAction<boolean>>