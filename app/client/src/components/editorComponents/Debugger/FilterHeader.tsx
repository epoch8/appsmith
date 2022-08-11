import React, { MutableRefObject, useRef } from "react";
import { get } from "lodash";
import Dropdown, { DropdownOption } from "components/ads/Dropdown";
import TextInput from "components/ads/TextInput";
import styled, { useTheme } from "styled-components";
import Icon, { IconSize } from "components/ads/Icon";
import { useDispatch } from "react-redux";

import { clearLogs } from "actions/debuggerActions";
import { Classes } from "components/ads/common";
import { TooltipComponent } from "design-system";
import { CLEAR_LOG_TOOLTIP, createMessage } from "@appsmith/constants/messages";
import { TOOLTIP_HOVER_ON_DELAY } from "constants/AppConstants";
import { Classes as BlueprintClasses } from "@blueprintjs/core";

const Wrapper = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
  padding: 8px 0;
  margin-left: 16px;

  .debugger-search {
    height: 32px;
    width: 560px;
  }

  .debugger-filter {
    /* border: none;
    box-shadow: none; */
    width: 260px;
    height: 32px;
    margin-left: 24px;
    min-height: 32px;
  }

  .input-container {
    display: flex;
    width: 560px;
    height: 32px;
    align-items: center;
    margin-left: 24px;
    .${Classes.ICON} {
      position: absolute;
      right: 9px;
    }
  }

  .${BlueprintClasses.POPOVER_WRAPPER} {
    display: flex;
    align-items: center;
  }
`;

type FilterHeaderProps = {
  options: DropdownOption[];
  selected: DropdownOption;
  onChange: (value: string) => void;
  onSelect: (value?: string) => void;
  defaultValue: string;
  searchQuery: string;
};

function FilterHeader(props: FilterHeaderProps) {
  const dispatch = useDispatch();
  const searchRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const theme = useTheme();
  return (
    <Wrapper>
      <TooltipComponent
        content={createMessage(CLEAR_LOG_TOOLTIP)}
        hoverOpenDelay={TOOLTIP_HOVER_ON_DELAY}
        position="bottom"
      >
        <Icon
          name="cancel"
          onClick={() => dispatch(clearLogs())}
          size={IconSize.XL}
        />
      </TooltipComponent>
      <div className="input-container">
        <TextInput
          className="debugger-search"
          cypressSelector="t--debugger-search"
          defaultValue={props.defaultValue}
          height="32px"
          onChange={props.onChange}
          placeholder="Filter"
          ref={searchRef}
          width="560px"
        />
        {props.searchQuery && (
          <Icon
            fillColor={get(theme, "colors.debugger.jsonIcon")}
            hoverFillColor={get(theme, "colors.debugger.message")}
            name="close-circle"
            onClick={() => {
              if (searchRef.current) {
                props.onChange("");
                searchRef.current.value = "";
              }
            }}
            size={IconSize.XXL}
          />
        )}
      </div>
      <Dropdown
        className="debugger-filter"
        height="32px"
        onSelect={props.onSelect}
        optionWidth="260px"
        options={props.options}
        selected={props.selected}
        showLabelOnly
        width="260px"
      />
    </Wrapper>
  );
}

export default FilterHeader;
