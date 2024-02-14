import React, { HTMLAttributes } from "react";

type CustomDivProps = HTMLAttributes<HTMLDivElement> & {
  container: string;
};

const CustomDiv: React.FC<CustomDivProps> = (props) => {
  const { container, ...otherProps } = props;

  return (
    <div {...otherProps} {...props}>
      {props.children}{" "}
    </div>
  );
};

export default CustomDiv;
