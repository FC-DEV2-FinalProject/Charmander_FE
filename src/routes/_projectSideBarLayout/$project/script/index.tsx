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
// import ShortScriptTemplate from '@/assets/projectIcon/scriptTemplateShort.svg?react';
// import LongScriptTemplate from '@/assets/projectIcon/scriptTemplateLong.svg?react';
// import TransparentBackground from '@/assets/projectIcon/transparentBackground.svg?react';

export const Route = createFileRoute('/_projectSideBarLayout/$project/script/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  // const fonts = [
  //   'NexonLv2',
  //   'Noto Sans KR',
  //   'Nanum Gothic',
  //   'Nanum Myeongjo',
  //   'IBM Plex Sans KR',
  //   'Gmarket Sans',
  //   'Spoqa Han Sans',
  //   'Arial',
  //   'Times New Roman',
  //   'Verdana',
  // ];
  // const weights = ['얇게', '중간', '굵게'];
  // const sizes = Object.values(theme.fontSizes);
  // const backgrounds = ['short', 'long', 'transparent'];

  // const [backgroundStyle, setBackgroundStyle] = useState('short');
  // const [promptValue, setPromptValue] = useState('');
  const { aspectRatio } = useAspectRatioStore();
  const { projectData, updateTranscripts } = useProjectEditorStore();
  const [termValue, setTermValue] = useState(`0.5`);
  const [subtitles, setSubtitles] = useState<Transcript[]>(
    projectData?.scenes[0].transcripts || [
      {
        id: 1,
        sceneId: projectData?.scenes[0]?.id ?? 1,
        text: '대사를 입력해주세요.',
        property: {
          speed: 1,
          postDelay: 500,
        },
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      },
    ]
  );
  const [selectedSubtitle, setSelectedSubtitle] = useState<Transcript | null>(
    null
  );

  const debouncedSubtitles = useDebounce(subtitles, 1000);

  const addSubtitle = async () => {
    try {
      if (!projectData) {
        return;
      }
      const newSubtitle = await postTranscript(
        projectData?.id,
        projectData?.scenes[0].id
      );

      setSubtitles((prevSubtitles) => [...prevSubtitles, newSubtitle]);
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

    setSubtitles((prevSubtitles) =>
      prevSubtitles.map((subtitle) =>
        subtitle.id === id ? { ...subtitle, [field]: value } : subtitle
      )
    );

    const existingSubtitle = projectData.scenes[0].transcripts.find(
      (t) => t.id === id
    );
    if (existingSubtitle && existingSubtitle[field] === value) return;

    updateTranscripts(projectData.scenes[0].id, id, { [field]: value });
  };

  const deleteSubtitle = async (id: number) => {
    if (!projectData) return;

    try {
      await deleteTranscript(projectData.id, projectData.scenes[0].id, id);
      setSubtitles((prevSubtitles) =>
        prevSubtitles.filter((subtitle) => subtitle.id !== id)
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('자막 삭제 실패:', error);
    }
  };

  useEffect(() => {
    if (selectedSubtitle) {
      setTermValue((selectedSubtitle.property.postDelay / 1000).toString());
    }
  }, [selectedSubtitle]);

  const handleTermValueChange = (value: string) => {
    setTermValue(value);
  };

  const handleTermValueBlur = () => {
    if (selectedSubtitle) {
      const parsedValue = parseFloat(termValue);

      if (!isNaN(parsedValue)) {
        const updatedSubtitle = {
          ...selectedSubtitle,
          property: {
            ...selectedSubtitle.property,
            postDelay: parsedValue * 1000,
          },
        };
        updateTranscripts(
          projectData?.scenes[0].id ?? 0,
          updatedSubtitle.id,
          updatedSubtitle
        );
        setSelectedSubtitle(updatedSubtitle);
        setTermValue(parsedValue.toString());
        setSubtitles((prevSubtitles) =>
          prevSubtitles.map((subtitle) =>
            subtitle.id === updatedSubtitle.id ? updatedSubtitle : subtitle
          )
        );
      }
    }
  };

  // subtitles 업데이트 시 store에 반영
  useEffect(() => {
    if (!projectData) return;

    subtitles.forEach((subtitle) => {
      const existingSubtitle = projectData.scenes[0].transcripts.find(
        (t) => t.id === subtitle.id
      );

      if (
        existingSubtitle &&
        JSON.stringify(existingSubtitle) !== JSON.stringify(subtitle)
      ) {
        updateTranscripts(projectData.scenes[0].id, subtitle.id, subtitle);
      }
    });
  }, [subtitles, updateTranscripts, projectData]);

  useEffect(() => {
    if (!projectData) return;

    const patchUpdatedSubtitles = async () => {
      try {
        const originalTranscripts = projectData.scenes[0].transcripts ?? [];

        const modifiedSubtitles = (debouncedSubtitles ?? []).filter(
          (subtitle) => {
            const original = originalTranscripts.find(
              (t) => t.id === subtitle.id
            );
            return (
              original && JSON.stringify(original) !== JSON.stringify(subtitle)
            );
          }
        );

        if (modifiedSubtitles.length === 0) return;

        await Promise.all(
          modifiedSubtitles.map((subtitle) =>
            patchTranscript(
              projectData.id,
              projectData.scenes[0].id,
              subtitle.id,
              subtitle
            )
          )
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('자막 업데이트 실패:', error);
      }
    };

    patchUpdatedSubtitles();
  }, [debouncedSubtitles, projectData]);
  // const selectedSubtitle = subtitles.find(
  //   (subtitle) => subtitle.id === selectedSubtitleId
  // );

  // const handlePromptInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPromptValue(event.target.value);
  // };
  return (
    <S.ScriptContainer>
      <S.ScriptMain>
        <S.ScriptSection>
          {subtitles.map((subtitle) => (
            <ScriptSection
              key={subtitle.id}
              id={subtitle.id}
              text={subtitle.text}
              // font={subtitle.font}
              // weight={subtitle.weight}
              // size={subtitle.size}
              // backgroundStyle={subtitle.backgroundStyle}
              onDelete={deleteSubtitle}
              handleSubTitle={handleSubtitle}
              onSelect={() => setSelectedSubtitle(subtitle)}
              isSelected={selectedSubtitle?.id === subtitle.id}
            />
          ))}
          <S.AddScriptButton onClick={addSubtitle}>문단 추가</S.AddScriptButton>
        </S.ScriptSection>
        <S.VideoSection>
          <S.VideoVeiwPort aspectRatio={aspectRatio}>
            <S.SelectedBackgroundImage
              aspectRatio={aspectRatio}
              src={projectData?.scenes[0].media?.fileUrl}
              alt={projectData?.scenes[0].media?.name}
            />
            <S.SelectedAvatarImage
              aspectRatio={aspectRatio}
              src={projectData?.scenes[0].avatar?.fileUrl}
              autoPlay={true}
            />
          </S.VideoVeiwPort>
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
            onBlur={handleTermValueBlur}
          />
        </S.ScriptTerm>
        <>
          {/* <S.PromptSection>
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
        </S.TemplateSection> */}
        </>
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
  VideoVeiwPort: styled.div<{ aspectRatio: string }>`
    ${(props) =>
      props.aspectRatio === '16:9(pc)' ? 'width:100%;' : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    position: relative;
    border: 2px solid ${theme.colors.secondary1};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  SelectedBackgroundImage: styled.img<{ aspectRatio: string }>`
    ${(props) =>
      props.aspectRatio === '16:9(pc)' ? 'width:100%;' : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    position: absolute;
  `,
  SelectedAvatarImage: styled.video<{ aspectRatio: string }>`
    ${(props) =>
      props.aspectRatio === '16:9(pc)' ? 'width:100%;' : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    position: absolute;
    z-index: 1;
  `,
  VideoInnerScriptContainer: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.xxlarge};
    padding: ${theme.spacing.md};
    z-index: 2;
  `,
  VideoInnerScriptWrapper: styled.div<{ backgroundStyle: string }>`
    width: ${(props) => (props.backgroundStyle === 'short' ? '50%' : '100%')};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
      props.backgroundStyle !== 'transparent'
        ? theme.colors.primary
        : 'transparent'};
    border-radius: ${theme.radius.xxlarge};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    z-index: 2;
  `,
  // VideoInnerScript: styled.span<{ font: string; weight: string; size: string }>`
  //   font-family: ${(props) => props.font};
  //   font-weight: ${(props) =>
  //     props.weight === '얇게'
  //       ? theme.fontWeights.light
  //       : props.weight === '중간'
  //         ? theme.fontWeights.medium
  //         : theme.fontWeights.bold};
  //   font-size: ${(props) => props.size};
  //   color: ${theme.colors.white};
  //   text-align: center;
  // `,
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
  // PromptSection: styled.div`
  //   width: 90%;
  //   display: flex;
  //   flex-direction: column;
  // `,
  // PromptInputContainer: styled.div`
  //   width: 100%;
  //   display: flex;
  //   justify-content: center;
  //   gap: ${theme.spacing.sm};
  // `,
  // PromptInput: styled.input`
  //   width: 90%;
  //   border: 1px solid ${theme.colors.border1};
  //   border-radius: ${theme.radius.small};
  //   padding: ${theme.spacing.sm};
  //   &: focus {
  //     outline: 2px solid ${theme.colors.secondary1};
  //   }
  // `,
  // PromptSubmitButton: styled.button`
  //   width: 10%;
  //   min-width: 50px;
  //   border: 1px solid ${theme.colors.border1};
  //   border-radius: ${theme.radius.small};
  //   padding: ${theme.spacing.sm};
  //   font-weight: ${theme.fontWeights.medium};
  // `,
  // FontStyleSection: styled.div`
  //   width: 90%;
  //   display: flex;
  //   flex-direction: column;
  //   gap: ${theme.spacing.sm};
  // `,
  // DropDownContainer: styled.div`
  //   display: flex;
  //   flex-wrap: wrap;
  //   gap: 5%;
  //   row-gap: ${theme.spacing.sm};
  // `,
  // TemplateSection: styled.div`
  //   width: 90%;
  //   height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   gap: ${theme.spacing.sm};
  // `,
  LabelSection: styled.div`
    display: flex;
    align-items: center;
  `,
  SidebarLabel: styled.label`
    margin-left: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.fz20};
    font-weight: ${theme.fontWeights.medium};
  `,
  // ScriptTemplateList: styled.div`
  //   width: 100%;
  //   max-height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   padding: ${theme.spacing.sm};
  //   gap: ${theme.spacing.sm};
  //   overflow-x: hidden;
  //   &::-webkit-scrollbar {
  //     display: none;
  //   }
  // `,
  // ScriptTemplateCard: styled.div<{ isSelected: boolean }>`
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   padding: ${theme.spacing.sm};
  //   width: 100%;
  //   height: 100%;
  //   border: 2px solid
  //     ${(props) =>
  //       props.isSelected ? theme.colors.secondary1 : theme.colors.border1};
  //   border-radius: ${theme.radius.medium};
  //   background-color: ${(props) =>
  //     props.isSelected ? theme.colors.background1 : 'transparent'};
  //   svg {
  //     width: 115px;
  //   }
  // `,
  // ScriptTemplateName: styled.span`
  //   font-size: ${theme.fontSizes.fz14};
  // `,
};
