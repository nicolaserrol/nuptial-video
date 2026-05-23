import React, { createContext, useContext } from "react";
import { NUPTIAL_BRAND, type NuptialBrand } from "./tokens";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadPlayfair();
loadInter();

const BrandContext = createContext<NuptialBrand>(NUPTIAL_BRAND);

export const BrandTheme: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <BrandContext.Provider value={NUPTIAL_BRAND}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
