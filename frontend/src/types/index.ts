export interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MathSymbol {
  symbol: string;
  latex: string;
  description: string;
  displayMode?: 'inline' | 'block';
}

export interface ChemistrySymbol {
  symbol: string;
  latex: string;
  description: string;
  displayMode?: 'inline' | 'block';
}
