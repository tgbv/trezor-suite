import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import {
    getStatusColor,
    getStatusName,
    getStatus,
    getVersion,
} from 'utils/device';
import TrezorImage from 'components/images/TrezorImage';
import colors from 'config/colors';

const Wrapper = styled.div`
    position: relative;
    height: 64px;
    width: 320px;
    display: flex;
    align-items: center;
    background: ${props => (props.disabled ? colors.GRAY_LIGHT : 'transparent')};
    background: ${props => (props.isSelected ? colors.WHITE : 'transparent')};

    border-radius: 4px 0 0 0;
    box-shadow: ${props => (props.disabled ? 'none' : '0 3px 8px rgba(0, 0, 0, 0.04)')};

    ${props => (props.isOpen || !props.isSelected) && css`
        box-shadow: none;
    `}

    ${props => props.isHoverable && css`
        &:hover {
            background: ${colors.GRAY_LIGHT};
        }
    `}
`;

const ClickWrapper = styled.div`
    width: 100%;
    display: flex;
    padding-left: 25px;
    height: 100%;
    align-items: center;
    cursor: pointer;

    ${props => props.disabled && css`
        cursor: not-allowed;
    `}
`;

const LabelWrapper = styled.div`
    flex: 1;
    padding-left: 18px;
`;

const Name = styled.div`
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: no-wrap;
    font-weight: 500;
    font-size: 14px;
    color: ${colors.TEXT_PRIMARY};
`;

const Status = styled.div`
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: ${colors.TEXT_SECONDARY};
`;

const IconWrapper = styled.div`
    padding-right: 25px;
    display: flex;
`;

const ImageWrapper = styled.div`
    position: relative;
`;

const Dot = styled.div`
    border: 2px solid ${colors.WHITE};
    border-radius: 50%;
    position: absolute;
    z-index: 10;
    background: ${props => props.color};
    top: -4px;
    right: -3px;
    width: 10px;
    height: 10px;
`;


const DeviceHeader = ({
    isOpen, icon, device, isHoverable = true, onClickWrapper, disabled = false, isSelected = false,
}) => {
    const status = getStatus(device);
    return (
        <Wrapper
            isSelected={isSelected}
            isOpen={isOpen}
            isHoverable={isHoverable}
            disabled={disabled}
        >
            <ClickWrapper disabled={disabled} onClick={onClickWrapper}>
                <ImageWrapper>
                    <Dot color={getStatusColor(status)} />
                    <TrezorImage model={getVersion(device)} />
                </ImageWrapper>
                <LabelWrapper>
                    <Name>{device.instanceLabel}</Name>
                    <Status>{getStatusName(status)}</Status>
                </LabelWrapper>
                <IconWrapper>
                    {icon && !disabled && icon}
                </IconWrapper>
            </ClickWrapper>
        </Wrapper>
    );
};

DeviceHeader.propTypes = {
    device: PropTypes.object,
    icon: PropTypes.element,
    isHoverable: PropTypes.bool,
    disabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isSelected: PropTypes.bool,
    onClickWrapper: PropTypes.func.isRequired,
};

export default DeviceHeader;
