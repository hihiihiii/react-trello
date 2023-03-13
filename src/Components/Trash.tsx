import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { trashState } from "../atoms";
import { AiTwotoneDelete } from "react-icons/ai";

const Wrapper = styled.div`
  /* display: none; */
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e74c3c;
  /* transform: translate(50%, -50%); */
  top: -40px;
  left: 50%;
`;

const TrashIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 30px;
`;

const Trash = () => {
  //false
  const trashCan = useRecoilValue(trashState);

  return (
    <Droppable droppableId="trashCan">
      {(magic) => {
        return (
          <Wrapper ref={magic.innerRef} {...magic.droppableProps}>
            <TrashIcon>
              <AiTwotoneDelete></AiTwotoneDelete>
            </TrashIcon>
            {magic.placeholder}
          </Wrapper>
        );
      }}
    </Droppable>
  );
};

export default Trash;
