import ScriptTermInput from '@/components/project-editor/scriptTermInput';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ScriptSection from '@/components/project-editor/scriptSection';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import useAspectRatioStore from '@/store/useAspectRatioStore';
import { Transcript } from '@/types/projectData';
import {
  deleteTranscript,
  patchTranscript,
  postTranscript,
} from '@/api/project/api';
import { useDebounce } from '@/hook/useDebounce';
import VideoViewPortComponent from '@/components/project-editor/scriptViewPort';
import { useSubtitleSync } from '@/hook/useSubtitleSync';
import ShortScriptTemplate from '@/assets/projectIcon/scriptTemplateShort.svg?react';
import LongScriptTemplate from '@/assets/projectIcon/scriptTemplateLong.svg?react';
import TransparentBackground from '@/assets/projectIcon/transparentBackground.svg?react';
import DropDown from '@/components/common/dropdown';
import { fontStyle } from '@/constants/fontStyle';

export const Route = createFileRoute('/_projectSideBarLayout/$project/script/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { fonts, weights, sizes } = fontStyle();
  const { aspectRatio } = useAspectRatioStore();
  const {
    projectData,
    updateTranscripts,
    addTranscript,
    removeTranscript,
    updateSubtitle,
  } = useProjectEditorStore();
  const [termValue, setTermValue] = useState(`1`);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedTranscript, setSelectedTranscript] =
    useState<Transcript | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState('short');
  const subtitleData = projectData?.scenes[0].subtitle;

  useEffect(() => {
    if (projectData) {
      setTranscripts(projectData.scenes[0].transcripts);
    }
  }, [projectData]);

  const debouncedTranscripts = useDebounce(transcripts, 1000);

  useSubtitleSync({ projectData, debouncedTranscripts, updateTranscripts });

  const addSubtitle = async () => {
    try {
      if (!projectData) {
        return;
      }
      const newSubtitle = await postTranscript(
        projectData?.id,
        projectData?.scenes[0].id
      );

      setTranscripts((prevTranscript) => [...prevTranscript, newSubtitle]);
      addTranscript(projectData.scenes[0].id, newSubtitle);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleSubtitle = (
    id: number,
    field: keyof Transcript,
    value: string
  ) => {
    if (!projectData) return;

    setTranscripts((prevTranscript) =>
      prevTranscript.map((transcript) =>
        transcript.id === id ? { ...transcript, [field]: value } : transcript
      )
    );
  };

  const deleteSubtitle = async (id: number) => {
    if (!projectData) return;

    try {
      await deleteTranscript(projectData.id, projectData.scenes[0].id, id);
      setTranscripts((prevTranscript) =>
        prevTranscript.filter((transcript) => transcript.id !== id)
      );
      removeTranscript(projectData.scenes[0].id, id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('자막 삭제 실패:', error);
    }
  };

  useEffect(() => {
    if (selectedTranscript) {
      setTermValue((selectedTranscript.property.postDelay / 1000).toString());
    }
  }, [selectedTranscript]);

  const handleTermValueChange = (value: string) => {
    setTermValue(value);
  };

  const debouncedTermValue = useDebounce(termValue, 1000);

  useEffect(() => {
    const saveTermValue = async () => {
      if (selectedTranscript && !isNaN(parseFloat(debouncedTermValue))) {
        const parsedValue = parseFloat(debouncedTermValue);
        const updatedSubtitle = {
          ...selectedTranscript,
          property: {
            ...selectedTranscript.property,
            postDelay: parsedValue * 1000, // 필요한 경우 변환
          },
        };

        try {
          await patchTranscript(
            projectData?.id ?? 0,
            projectData?.scenes[0].id ?? 0,
            updatedSubtitle.id,
            updatedSubtitle
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('Term 저장 실패:', error);
        }
      }
    };

    saveTermValue();
  }, [debouncedTermValue, projectData, selectedTranscript]);

  return (
    <S.ScriptContainer>
      <S.ScriptMain>
        <S.ScriptSection>
          {transcripts.map((transcript) => (
            <ScriptSection
              key={transcript.id}
              id={transcript.id}
              text={transcript.text}
              onDelete={deleteSubtitle}
              handleSubTitle={handleSubtitle}
              onSelect={() => {
                setSelectedTranscript(transcript);
              }}
              isSelected={selectedTranscript?.id === transcript.id}
            />
          ))}
          <S.AddScriptButton onClick={addSubtitle}>문단 추가</S.AddScriptButton>
        </S.ScriptSection>
        <S.VideoSection>
          <VideoViewPortComponent aspectRatio={aspectRatio} />
        </S.VideoSection>
      </S.ScriptMain>

      <S.ScriptToolbar>
        <S.ScriptTerm>
          <S.LabelSection>
            <S.SidebarLabel>대사 간격</S.SidebarLabel>
          </S.LabelSection>
          <ScriptTermInput
            value={termValue}
            setValue={handleTermValueChange}
          />
        </S.ScriptTerm>
        <S.FontStyleSection>
          <S.LabelSection>
            <S.SidebarLabel>자막 스타일</S.SidebarLabel>
          </S.LabelSection>
          <S.DropDownContainer>
            <DropDown
              dropDownData={fonts}
              width="100%"
              onSelect={(data) =>
                projectData?.scenes[0]?.id !== undefined &&
                updateSubtitle(projectData.scenes[0].id, {
                  property: {
                    fontFamily: data || 'default-font-family',
                    fontSize: subtitleData?.property?.fontSize ?? 16,
                    fontWeight: subtitleData?.property?.fontWeight ?? 'normal',
                    fontColor:
                      subtitleData?.property?.fontColor ??
                      `${theme.colors.black}`,
                    backgroundColor:
                      subtitleData?.property?.backgroundColor ??
                      `${theme.colors.primary}`,
                    backgroundStyle:
                      subtitleData?.property?.backgroundStyle ?? 'short',
                    position: subtitleData?.property?.position ?? {
                      x: 0,
                      y: 0,
                    },
                  },
                })
              }
            />
            <DropDown
              dropDownData={weights}
              width="50%"
              onSelect={(data) =>
                projectData?.scenes[0]?.id !== undefined &&
                updateSubtitle(projectData.scenes[0].id, {
                  property: {
                    fontFamily:
                      subtitleData?.property?.fontFamily ??
                      'default-font-family',
                    fontSize: subtitleData?.property?.fontSize ?? 16,
                    fontWeight: data ?? 'normal',
                    fontColor:
                      subtitleData?.property?.fontColor ??
                      `${theme.colors.black}`,
                    backgroundColor:
                      subtitleData?.property?.backgroundColor ??
                      `${theme.colors.primary}`,
                    backgroundStyle:
                      subtitleData?.property?.backgroundStyle ?? 'short',
                    position: subtitleData?.property?.position ?? {
                      x: 0,
                      y: 0,
                    },
                  },
                })
              }
            />
            <DropDown
              dropDownData={sizes}
              width="45%"
              onSelect={(data) => {
                if (projectData?.scenes[0]?.id !== undefined) {
                  updateSubtitle(projectData.scenes[0].id, {
                    property: {
                      fontFamily:
                        subtitleData?.property?.fontFamily ??
                        'default-font-family',
                      fontSize: parseFloat(data) || 16,
                      fontWeight:
                        subtitleData?.property?.fontWeight ?? 'normal',
                      fontColor:
                        subtitleData?.property?.fontColor ??
                        `${theme.colors.black}`,
                      backgroundColor:
                        subtitleData?.property?.backgroundColor ??
                        `${theme.colors.primary}`,
                      backgroundStyle:
                        subtitleData?.property?.backgroundStyle ?? 'short',
                      position: subtitleData?.property?.position ?? {
                        x: 0,
                        y: 0,
                      },
                    },
                  });
                }
              }}
            />
          </S.DropDownContainer>
        </S.FontStyleSection>
        <S.TemplateSection>
          <S.LabelSection>
            <S.SidebarLabel>자막 배경 스타일</S.SidebarLabel>
          </S.LabelSection>
          <S.ScriptTemplateList>
            <S.ScriptTemplateCard
              onClick={() => {
                setBackgroundStyle('short');
                if (projectData?.scenes[0]?.id !== undefined) {
                  updateSubtitle(projectData.scenes[0].id, {
                    property: {
                      fontFamily:
                        subtitleData?.property?.fontFamily ??
                        'default-font-family',
                      fontSize: subtitleData?.property?.fontSize ?? 16,
                      fontWeight:
                        subtitleData?.property?.fontWeight ?? 'normal',
                      fontColor:
                        subtitleData?.property?.fontColor ??
                        `${theme.colors.black}`,
                      backgroundColor:
                        subtitleData?.property?.backgroundColor ??
                        `${theme.colors.primary}`,
                      backgroundStyle: 'short',
                      position: subtitleData?.property?.position ?? {
                        x: 0,
                        y: 0,
                      },
                    },
                  });
                }
              }}
              isSelected={backgroundStyle === 'short'}>
              <S.ScriptTemplateName>짧은 배경</S.ScriptTemplateName>
              <ShortScriptTemplate />
            </S.ScriptTemplateCard>
            <S.ScriptTemplateCard
              onClick={() => {
                setBackgroundStyle('long');
                if (projectData?.scenes[0]?.id !== undefined) {
                  updateSubtitle(projectData.scenes[0].id, {
                    property: {
                      fontFamily:
                        subtitleData?.property?.fontFamily ??
                        'default-font-family',
                      fontSize: subtitleData?.property?.fontSize ?? 16,
                      fontWeight:
                        subtitleData?.property?.fontWeight ?? 'normal',
                      fontColor:
                        subtitleData?.property?.fontColor ??
                        `${theme.colors.black}`,
                      backgroundColor:
                        subtitleData?.property?.backgroundColor ??
                        `${theme.colors.primary}`,
                      backgroundStyle: 'long',
                      position: subtitleData?.property?.position ?? {
                        x: 0,
                        y: 0,
                      },
                    },
                  });
                }
              }}
              isSelected={backgroundStyle === 'long'}>
              <S.ScriptTemplateName>긴 배경</S.ScriptTemplateName>
              <LongScriptTemplate />
            </S.ScriptTemplateCard>

            <S.ScriptTemplateCard
              onClick={() => {
                setBackgroundStyle('transparent');
                if (projectData?.scenes[0]?.id !== undefined) {
                  updateSubtitle(projectData.scenes[0].id, {
                    property: {
                      fontFamily:
                        subtitleData?.property?.fontFamily ??
                        'default-font-family',
                      fontSize: subtitleData?.property?.fontSize ?? 16,
                      fontWeight:
                        subtitleData?.property?.fontWeight ?? 'normal',
                      fontColor:
                        subtitleData?.property?.fontColor ??
                        `${theme.colors.black}`,
                      backgroundColor:
                        subtitleData?.property?.backgroundColor ??
                        `${theme.colors.primary}`,
                      backgroundStyle: 'transparent',
                      position: subtitleData?.property?.position ?? {
                        x: 0,
                        y: 0,
                      },
                    },
                  });
                }
              }}
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
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
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
    justify-content: center;
    align-items: center;
    padding: ${theme.spacing.md};
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

  LabelSection: styled.div`
    display: flex;
    align-items: center;
  `,
  SidebarLabel: styled.label`
    margin-left: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.fz20};
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
