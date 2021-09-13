import React from "react";

import { Spinner } from "./styles";

interface props {
  size?: number;
  borderSize?: number;
  borderColor?: string;
  colorLoading?: string;
}

const Loading: React.FC<props> = ({
  size,
  borderColor,
  borderSize,
  colorLoading,
}) => {
  let styles = {
    height: size,
    width: size,
    border: `${borderSize}px solid ${borderColor}`,
    borderLeftColor: colorLoading,
    borderTopColor: borderColor,
    borderRightColor: borderColor,
    borderBottomColor: borderColor,
  };

  return <Spinner style={styles}></Spinner>;
};

export default Loading;
