import React from "react";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Text = styled.li`
  color: white;
  font-size: 24px;
  font-weight: 500;
`;

const App = () => {
  // DragDropContext 특정 영역에만 생성한다.
  // Context 안에 dom과 onDragEnd 아규먼트가 필요하다.
  // Droppable 은 어떤 것을 드롭할 수 있는 영역이다.
  // Draggable 은 어떤 것을 드래그 할 수 있는 영역.
  // Droppable props doppableId 드롭할 수 있는 영역이 여러개일 수 있기 때문에
  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one">
          {/* Droppable의 children은 함수여야 */}
          {() => {
            return (
              <ul>
                <Draggable draggableId="one" index={0}>
                  {() => <Text>first</Text>}
                </Draggable>
                <Draggable draggableId="two" index={1}>
                  {() => <Text>second</Text>}
                </Draggable>
              </ul>
            );
          }}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default App;
