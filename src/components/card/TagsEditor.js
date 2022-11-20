import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  optimisticLabelUpdate,
  updateLabel,
  createLabel,
} from '../labels/labelsSlice';

const DEFAULT_COLORS = [
  '#e0ffff',
  '#add8e6',
  '#87cefa',
  '#00bbf0',
  '#fff0f5',
  '#fecea8',
  '#ffb5b5',
  '#ff847c',
  '#e0ffcd',
  '#c5f0a4',
  '#cbf078',
  '#00fa9a',
  '#ffebbb',
  '#fdc57b',
  '#fdb44b',
  '#ff9a3c',
];

const TileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tile = styled.button`
  width: 60px;
  height: 32px;
  border-radius: 0.375rem;
  background-color: ${(props) => props.bgColor};

  &:focus {
    outline: 2px solid darkblue;
  }
`;

const NewLabelButton = styled.button`
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  background-color: #eee;
  border-radius: 0.25rem;
  transition: opacity 0.35s ease;

  &:hover {
    opacity: 0.6;
  }
`;

const ActivableTile = styled.div`
  display: flex;
  gap: 0.2rem;
`;

const TileActivationButton = styled.button`
  width: 32px;
  height: 24px;
  padding: 0.1rem;
  background-color: #eee;
  flex-shrink: 0;
  border-radius: 0.375rem;

  transition: opacity 0.35s ease;

  &:hover {
    opacity: 0.6;
  }
`;

const LabelTile = styled.div`
  flex: 1;
  padding: 0.25rem;
  text-align: center;
  border-radius: 0.25rem;
  background-color: ${(props) => props.bgColor};
`;

const LabelPreview = styled.div`
  height: 92px;
  display: flex;
  background-color: darkgray;
`;

const LabelTitle = styled.input`
  padding: 0.5rem;
  background-color: #eee;
  border-radius: 0.25rem;
  border: 1px solid darkgray;
  width: 100%;

  &:focus {
    background-color: initial;
    outline-color: darkblue;
  }
`;

const ActionButton = styled.button`
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
  border-radius: 0.375rem;
  background-color: ${(props) => props.bgColor};
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.7;
  }
`;

function TagsEditor() {
  const dispatch = useDispatch();
  const boardLabels = useSelector((state) => state.labels.items);
  const [editIsActive, setEditIsActive] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState(null);
  const [selectedNewColor, setSelectedNewColor] = useState(null);
  const [actionType, setActionType] = useState(null);
  const labelTextRef = useRef(null);

  const handleNewLabel = () => {
    handleLabelEdition(
      {
        name: '',
        color: '#dddddd',
      },
      'create'
    );
  };

  const handleLabelCreation = () => {
    if (
      selectedNewColor !== null &&
      labelTextRef.current.value.trim().length >= 0
    ) {
      // save the label
      let labelToCreate = {
        color: selectedNewColor,
        name: labelTextRef.current.value,
      };
      dispatch(createLabel(labelToCreate));
    }
    handleLabelEditingEnd();
  };

  const handleLabelToggle = (label) => {
    console.log(label);
  };
  const handleLabelEdition = (label, actionType) => {
    setEditIsActive(true);
    setLabelToEdit(label);
    setSelectedNewColor(label.color);
    setActionType(actionType);
  };
  const handleLabelEditingEnd = () => {
    setEditIsActive(false);
    setLabelToEdit(null);
    setSelectedNewColor(null);
    setActionType(null);
  };

  const handleLabelEditingSave = () => {
    if (
      selectedNewColor !== labelToEdit.color ||
      labelTextRef.current.value !== labelToEdit.name
    ) {
      // save the label
      let updatedLabel = {
        ...labelToEdit,
        color: selectedNewColor,
        name: labelTextRef.current.value,
      };
      dispatch(updateLabel(updatedLabel));
      dispatch(optimisticLabelUpdate(updatedLabel));
    }
    handleLabelEditingEnd();
  };
  return (
    <>
      <div>TagsEditor</div>
      {!editIsActive ? (
        <>
          <div>Labels</div>
          {Object.entries(boardLabels).map(([idx, label]) => {
            return (
              <ActivableTile key={idx}>
                <TileActivationButton onClick={() => handleLabelToggle(label)}>
                  +
                </TileActivationButton>
                <LabelTile bgColor={label.color}>{label.name}</LabelTile>

                <TileActivationButton
                  onClick={() => handleLabelEdition(label, 'edit')}
                >
                  <FaPen fontSize={'12px'} />
                </TileActivationButton>
              </ActivableTile>
            );
          })}
          <NewLabelButton onClick={handleNewLabel}>
            Create a label
          </NewLabelButton>
        </>
      ) : (
        <>
          Current Color
          <LabelPreview>
            <LabelTile bgColor={labelToEdit.color} />
          </LabelPreview>
          Title
          <LabelTitle ref={labelTextRef} defaultValue={labelToEdit.name} />
          Change the label's color:
          <div>You have selected {selectedNewColor}</div>
          <TileContainer>
            {DEFAULT_COLORS.map((color, index) => {
              return (
                <Tile
                  bgColor={color}
                  key={index + color}
                  onClick={() => setSelectedNewColor(color)}
                />
              );
            })}
          </TileContainer>
          <ActionButton bgColor={'lightgray'} onClick={handleLabelEditingEnd}>
            Return
          </ActionButton>
          <ActionButton
            bgColor={'lightblue'}
            onClick={
              actionType === 'edit'
                ? handleLabelEditingSave
                : handleLabelCreation
            }
          >
            Save
          </ActionButton>
        </>
      )}
    </>
  );
}

export default TagsEditor;
