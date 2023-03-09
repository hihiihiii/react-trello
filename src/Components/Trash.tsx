import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: red;
  cursor: pointer;
  bottom: 0;
`;

const Trash = () => {
  return (
    <Droppable droppableId="trashCan">
      {(magic) => {
        return (
          <Wrapper ref={magic.innerRef} {...magic.droppableProps}>
            {magic.placeholder}
          </Wrapper>
        );
      }}
    </Droppable>
  );
};

export default Trash;
