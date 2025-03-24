import DropDown from '@/components/common/dropdown';
import ScriptTermInput from '@/components/project-editor/scriptTermInput';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import styled from 'styled-components';
import ShortScriptTemplate from '@/assets/projectIcon/scriptTemplateShort.svg?react';
import LongScriptTemplate from '@/assets/projectIcon/scriptTemplateLong.svg?react';
import TransparentBackground from '@/assets/projectIcon/transparentBackground.svg?react';
import ScriptSection from '@/components/project-editor/scriptSection';
import { Subtitle } from '@/types/subtitle';

export const Route = createFileRoute('/_projectSideBarLayout/$project/script/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const fonts = [
    'NexonLv2',
    'Noto Sans KR',
    'Nanum Gothic',
    'Nanum Myeongjo',
    'IBM Plex Sans KR',
    'Gmarket Sans',
    'Spoqa Han Sans',
    'Arial',
    'Times New Roman',
    'Verdana',
  ];
  const weights = ['얇게', '중간', '굵게'];
  const sizes = Object.values(theme.fontSizes);
  const backgrounds = ['short', 'long', 'transparent'];

  const [termValue, setTermValue] = useState('0.5');
  const [backgroundStyle, setBackgroundStyle] = useState('short');
  const [promptValue, setPromptValue] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    {
      id: 1,
      text: '텍스트를 입력해 보세요',
      font: fonts[0],
      weight: weights[0],
      size: sizes[3],
      termValue: '0.5',
      backgroundStyle: backgrounds[0],
      promptValue: '',
    },
  ]);
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<number | null>(
    null
  );

  const addSubtitle = () => {
    const newSubtitle = {
      id: Date.now(),
      text: '텍스트를 입력해 보세요',
      font: fonts[0],
      weight: weights[0],
      size: sizes[3],
      termValue: '0.5',
      backgroundStyle: backgrounds[0],
      promptValue: '',
    };
    setSubtitles([...subtitles, newSubtitle]);
  };

  const updateSubtitle = (id: number, field: keyof Subtitle, value: string) => {
    setSubtitles(
      subtitles.map((subtitle) =>
        subtitle.id === id ? { ...subtitle, [field]: value } : subtitle
      )
    );
  };

  const deleteSubtitle = (id: number) => {
    setSubtitles(subtitles.filter((subtitle) => subtitle.id !== id));
    if (selectedSubtitleId === id) {
      setSelectedSubtitleId(null);
    }
  };

  const selectedSubtitle = subtitles.find(
    (subtitle) => subtitle.id === selectedSubtitleId
  );

  const handlePromptInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromptValue(event.target.value);
  };

  return (
    <S.ScriptContainer>
      <S.ScriptMain>
        <S.ScriptSection>
          {subtitles.map((subtitle) => (
            <ScriptSection
              key={subtitle.id}
              id={subtitle.id}
              text={subtitle.text}
              font={subtitle.font}
              weight={subtitle.weight}
              size={subtitle.size}
              backgroundStyle={subtitle.backgroundStyle}
              onDelete={deleteSubtitle}
              onUpdate={updateSubtitle}
              onSelect={() => setSelectedSubtitleId(subtitle.id)}
              isSelected={selectedSubtitleId === subtitle.id}
            />
          ))}
          <S.AddScriptButton onClick={addSubtitle}>문단 추가</S.AddScriptButton>
        </S.ScriptSection>
        <S.VideoSection>
          {selectedSubtitle && (
            <S.VideoInnerScriptContainer
              backgroundStyle={selectedSubtitle.backgroundStyle}>
              <S.VideoInnerScript
                font={selectedSubtitle.font}
                weight={selectedSubtitle.weight}
                size={selectedSubtitle.size}>
                {selectedSubtitle.text}
              </S.VideoInnerScript>
            </S.VideoInnerScriptContainer>
          )}
        </S.VideoSection>
      </S.ScriptMain>

      <S.ScriptToolbar>
        <S.ScriptTerm>
          <S.LabelSection>
            <S.SidebarLabel>대사 간격</S.SidebarLabel>
          </S.LabelSection>
          <ScriptTermInput
            value={termValue}
            setValue={setTermValue}
          />
        </S.ScriptTerm>
        <S.PromptSection>
          <S.LabelSection>
            <S.SidebarLabel>프롬프트 입력</S.SidebarLabel>
          </S.LabelSection>
          <S.PromptInputContainer>
            <S.PromptInput
              placeholder="예: 차갑게"
              value={promptValue}
              onChange={handlePromptInput}
            />
            <S.PromptSubmitButton>적용</S.PromptSubmitButton>
          </S.PromptInputContainer>
        </S.PromptSection>

        <S.FontStyleSection>
          <S.LabelSection>
            <S.SidebarLabel>자막 스타일</S.SidebarLabel>
          </S.LabelSection>
          <S.DropDownContainer>
            <DropDown
              dropDownData={fonts}
              width="100%"
              onSelect={(data) =>
                updateSubtitle(subtitles[0]?.id, 'font', data)
              }
            />
            <DropDown
              dropDownData={weights}
              width="50%"
              onSelect={(data) =>
                updateSubtitle(subtitles[0]?.id, 'weight', data)
              }
            />
            <DropDown
              dropDownData={sizes}
              width="45%"
              onSelect={(data) =>
                updateSubtitle(subtitles[0]?.id, 'size', data)
              }
            />
          </S.DropDownContainer>
        </S.FontStyleSection>

        <S.TemplateSection>
          <S.LabelSection>
            <S.SidebarLabel>자막 배경 스타일</S.SidebarLabel>
          </S.LabelSection>

          <S.ScriptTemplateList>
            <S.ScriptTemplateCard
              onClick={() => setBackgroundStyle('short')}
              isSelected={backgroundStyle === 'short'}>
              <S.ScriptTemplateName>짧은 배경</S.ScriptTemplateName>
              <ShortScriptTemplate />
            </S.ScriptTemplateCard>

            <S.ScriptTemplateCard
              onClick={() => setBackgroundStyle('long')}
              isSelected={backgroundStyle === 'long'}>
              <S.ScriptTemplateName>긴 배경</S.ScriptTemplateName>

              <LongScriptTemplate />
            </S.ScriptTemplateCard>

            <S.ScriptTemplateCard
              onClick={() => setBackgroundStyle('transparent')}
              isSelected={backgroundStyle === 'transparent'}>
              <S.ScriptTemplateName>배경 없음</S.ScriptTemplateName>

              <TransparentBackground />
            </S.ScriptTemplateCard>
          </S.ScriptTemplateList>
        </S.TemplateSection>
      </S.ScriptToolbar>
    </S.ScriptContainer>
  );
}
const S = {
  ScriptContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
  `,
  ScriptMain: styled.div`
    background-color: ${theme.colors.white};
    width: 70%;
    height: calc(100vh - 180px);
    padding: 75px;
    gap: ${theme.spacing.md};
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.xxlarge} 0 0 ${theme.radius.xxlarge};
  `,
  ScriptSection: styled.div`
    width: 50%;
    height: 100%;
  `,

  AddScriptButton: styled.button`
    width: 100%;
  `,
  VideoSection: styled.div`
    width: 50%;
    height: 100%;
    background-color: ${theme.colors.black};
    border-radius: ${theme.radius.medium};
    display: flex;
    flex-direction: column-reverse;
    padding: ${theme.spacing.md};
  `,
  VideoInnerScriptContainer: styled.div<{ backgroundStyle: string }>`
    width: ${(props) => (props.backgroundStyle === 'short' ? '' : '100%')};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
      props.backgroundStyle !== 'transparent'
        ? theme.colors.primary
        : 'transparent'};
    border-radius: ${theme.radius.xxlarge};
    padding: ${theme.spacing.md};
  `,
  VideoInnerScript: styled.span<{ font: string; weight: string; size: string }>`
    font-family: ${(props) => props.font};
    font-weight: ${(props) =>
      props.weight === '얇게'
        ? theme.fontWeights.light
        : props.weight === '중간'
          ? theme.fontWeights.medium
          : theme.fontWeights.bold};
    font-size: ${(props) => props.size};
    color: ${theme.colors.white};
    text-align: center;
  `,
  ScriptToolbar: styled.div`
    background-color: ${theme.colors.white};
    width: 30%;
    height: calc(100vh - 180px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.xl};
    border: 1px solid ${theme.colors.border1};
    border-radius: 0 ${theme.radius.xxlarge} ${theme.radius.xxlarge} 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  ScriptTerm: styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  `,
  PromptSection: styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
  `,
  PromptInputContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: ${theme.spacing.sm};
  `,
  PromptInput: styled.input`
    width: 90%;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm};
    &: focus {
      outline: 2px solid ${theme.colors.secondary1};
    }
  `,
  PromptSubmitButton: styled.button`
    width: 10%;
    min-width: 50px;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm};
    font-weight: ${theme.fontWeights.medium};
  `,
  FontStyleSection: styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  `,
  DropDownContainer: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5%;
    row-gap: ${theme.spacing.sm};
  `,
  TemplateSection: styled.div`
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  `,
  LabelSection: styled.div`
    display: flex;
    align-items: center;
  `,
  SidebarLabel: styled.label`
    margin-left: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.fz20};
    font-weight: ${theme.fontWeights.medium};
  `,
  ScriptTemplateList: styled.div`
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.sm};
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  ScriptTemplateCard: styled.div<{ isSelected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.sm};
    width: 100%;
    height: 100%;
    border: 2px solid
      ${(props) =>
        props.isSelected ? theme.colors.secondary1 : theme.colors.border1};
    border-radius: ${theme.radius.medium};
    background-color: ${(props) =>
      props.isSelected ? theme.colors.background1 : 'transparent'};
    svg {
      width: 115px;
    }
  `,
  ScriptTemplateName: styled.span`
    font-size: ${theme.fontSizes.fz14};
  `,
};
