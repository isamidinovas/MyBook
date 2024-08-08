export type IRecomendation = {
  value: string;
  label: string;
};

export const recomendations: IRecomendation[] = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Popular" },
];
