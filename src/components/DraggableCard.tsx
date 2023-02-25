import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDraggableCard{
    index:number,
    toDoId:number,
    toDoText:string
}

const Card=styled.div<{isDragging:Boolean}>`
    background-color: ${props=>props.isDragging ? "#74b9ff" : props.theme.cardColor};
    box-shadow:${props=>props.isDragging ? "0px 2px 10px rgba(0,0,0,0.3)" : "none"};
    padding:10px 10px;
    border-radius: 5px;
    margin-bottom: 5px;
`;

function DraggableCard({index,toDoId,toDoText}:IDraggableCard){
    return <Draggable draggableId={toDoId+""} index={index}>
        {(provided, snapshot) => 
        <Card ref={provided.innerRef}
        isDragging={snapshot.isDragging}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
            {toDoText}
        </Card>}
    </Draggable>
}

export default React.memo(DraggableCard);