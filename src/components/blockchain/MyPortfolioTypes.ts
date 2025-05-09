export interface TokenBalance {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  icon?: string;
}

export interface ContractFunction {
  name: string;
  description: string;
  params: {
    name: string;
    type: string;
    description: string;
  }[];
}

export interface SmartContract {
  id: string;
  name: string;
  description: string;
  language: 'python' | 'solidity';
  functions: ContractFunction[];
  deployedAt: string;
}
