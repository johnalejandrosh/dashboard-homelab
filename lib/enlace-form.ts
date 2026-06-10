export type CreateEnlaceState = {
  error: string | null;
  success: boolean;
};

export const createEnlaceInitialState: CreateEnlaceState = {
  error: null,
  success: false,
};
