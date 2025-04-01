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
import VideoViewPortComponent from '@/components/project-editor/scriptVeiwPort';

export const Route = createFileRoute('/_projectSideBarLayout/$project/script/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { aspectRatio } = useAspectRatioStore();
  const { projectData, updateTranscripts } = useProjectEditorStore();
  const [termValue, setTermValue] = useState(`0.5`);
  const [subtitles, setSubtitles] = useState<Transcript[]>([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState<Transcript | null>(
    null
  );

  useEffect(() => {
    if (projectData) {
      setSubtitles(projectData.scenes[0].transcripts);
    }
  }, [projectData]);

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

  useEffect(() => {
    if (!projectData) return;

    debouncedSubtitles.forEach((subtitle) => {
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
  }, [debouncedSubtitles, updateTranscripts, projectData]);

  useEffect(() => {
    if (!projectData) return;
    const patchUpdatedSubtitles = async () => {
      try {
        const original = projectData.scenes[0].transcripts ?? [];
        const modified = (debouncedSubtitles ?? []).filter((subtitle) => {
          const orig = original.find((t) => t.id === subtitle.id);
          if (orig) {
            const isDifferent =
              orig.text !== subtitle.text ||
              orig.property.speed !== subtitle.property.speed ||
              orig.property.postDelay !== subtitle.property.postDelay;

            return isDifferent;
          }
          return false;
        });
        if (modified.length === 0) return;
        await Promise.all(
          modified.map((subtitle) =>
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

  return (
    <S.ScriptContainer>
      <S.ScriptMain>
        <S.ScriptSection>
          {subtitles.map((subtitle) => (
            <ScriptSection
              key={subtitle.id}
              id={subtitle.id}
              text={subtitle.text}
              onDelete={deleteSubtitle}
              handleSubTitle={handleSubtitle}
              onSelect={() => setSelectedSubtitle(subtitle)}
              isSelected={selectedSubtitle?.id === subtitle.id}
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
            onBlur={handleTermValueBlur}
          />
        </S.ScriptTerm>
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
};
