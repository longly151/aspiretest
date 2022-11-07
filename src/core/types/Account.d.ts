declare namespace Account {
  export type AccountInfo = {
    id: string;
    availableBalance: number;
    symbol: string;
    suggestedLimitValues: number[];
    weeklySpendingLimit: number;
  };

  export type Card = {
    id: string;
    name: string;
    cardNumber: string;
    logoImageUrl: string;
    backgroundColor: string;
    validThru: string;
    cvv: string;
    type: string;
  };
}
