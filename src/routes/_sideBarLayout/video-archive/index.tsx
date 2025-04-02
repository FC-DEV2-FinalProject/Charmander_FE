import { createFileRoute } from '@tanstack/react-router';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DownloadIcon from '@/assets/icons/icon-download.svg?react';
import CheckIcon from '@/assets/icons/icon-check.svg?react';
import LeftArrow from '@/assets/icons/icon-table-left-arrow.svg?react';
import RightArrow from '@/assets/icons/icon-table-right-arrow.svg?react';
import { getVideoArchive, videoArchiveType } from '@/api/video-archive/api';

export const Route = createFileRoute('/_sideBarLayout/video-archive/')({
  component: RouteComponent,
});

const STATUS: Record<string, string> = {
  PENDING: '대기중',
  IN_PROGRESS: '진행중',
  SUCCESS: '완료',
  FAILED: '실패',
  CANCELED: '취소됨',
};

function RouteComponent() {
  const [data, setData] = useState<videoArchiveType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getVideoArchive();
        setData(response.data);
      } catch (err) {
        alert(`${err}`);
      }
    };

    fetchProjects();
  }, []);

  const selectAllRow = (isChecked: boolean) => {
    if (isChecked) {
      const allSelected = data.reduce(
        (acc, item) => {
          acc[item.id] = true;
          return acc;
        },
        {} as { [key: number]: boolean }
      );
      setSelectedRows(allSelected);
    } else {
      setSelectedRows({});
    }
  };

  const selectRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSelection = { ...prev };
      if (newSelection[id]) {
        delete newSelection[id];
      } else {
        newSelection[id] = true;
      }
      return newSelection;
    });
  };

  const isAllSelected =
    data.length > 0 && Object.keys(selectedRows).length === data.length;

  const columns: ColumnDef<videoArchiveType>[] = [
    {
      accessorKey: 'task',
      header: () => (
        <div
          style={{
            position: 'relative',
          }}
          onClick={() => selectAllRow(!isAllSelected)}>
          <S.InputCheckbox
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => selectAllRow(e.target.checked)}
          />
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
            }}>
            {isAllSelected && <CheckIcon />}
          </span>
        </div>
      ),
      cell: (info) => (
        <div
          style={{ position: 'relative' }}
          onClick={() => selectRow(info.row.original.id)}>
          <S.InputCheckbox
            type="checkbox"
            checked={!!selectedRows[info.row.original.id]}
            onChange={() => selectRow(info.row.original.id)}
          />
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
            }}>
            {!!selectedRows[info.row.original.id] && <CheckIcon />}
          </span>
        </div>
      ),
      size: 25,
    },
    {
      accessorKey: 'updatedAt',
      header: '날짜',
      size: 80,
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return formattedDate;
      },
    },
    {
      accessorKey: 'status',
      header: '진행상태',
      size: 50,
      cell: (info) => (
        <S.Badge $progress={(info.getValue() as string) == 'IN_PROGRESS'}>
          {STATUS[info.getValue() as string] || '알수없음'}
        </S.Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: '파일명',
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'playTime',
      header: '재생시간',
      size: 80,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'output.fileUrl',
      header: '다운로드',
      size: 50,
      cell: (info) => (
        <S.DownloadBtn
          onClick={() => {
            const fileUrl = info.getValue() as string;
            if (fileUrl) {
              const link = document.createElement('a');
              link.href = fileUrl;
              link.download = fileUrl.split('/').pop() || 'download';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}>
          <DownloadIcon width={28} />
        </S.DownloadBtn>
      ),
    },
    {
      accessorKey: 'project',
      header: '프로젝트',
      cell: () => <S.LinkBtn>이동</S.LinkBtn>,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    onStateChange: (updater) => {
      const newState =
        typeof updater === 'function' ? updater(table.getState()) : updater;
      setPageIndex(newState.pagination.pageIndex);
      setPageSize(newState.pagination.pageSize);
    },
  });

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(event.target.value));
    setPageIndex(0);
  };

  return (
    <S.VideoArchiveWrap>
      <S.VideoTableContent>
        <div
          style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}>
            {[10, 20, 30, 40, 50].map((size) => (
              <option
                key={size}
                value={size}>
                {size}개
              </option>
            ))}
          </select>
          <S.DeleteBtn>삭제</S.DeleteBtn>
        </div>
        <S.Table>
          <S.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </S.Thead>
          <S.Tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </S.Tbody>
        </S.Table>
        <S.PaginationWrapper>
          <S.PaginationArrowBtn
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 1)
            }
            disabled={!table.getCanPreviousPage()}>
            <LeftArrow width={20} /> 이전
          </S.PaginationArrowBtn>

          {table.getPageCount() > 1 && (
            <>
              {Array.from({ length: table.getPageCount() }).map((_, index) => (
                <S.PaginationBtn
                  key={index}
                  onClick={() => table.setPageIndex(index)}
                  isActive={table.getState().pagination.pageIndex === index}>
                  {index + 1}
                </S.PaginationBtn>
              ))}
            </>
          )}

          <S.PaginationArrowBtn
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 1)
            }
            disabled={!table.getCanNextPage()}>
            다음 <RightArrow width={20} />
          </S.PaginationArrowBtn>
        </S.PaginationWrapper>
      </S.VideoTableContent>
    </S.VideoArchiveWrap>
  );
}

const S = {
  VideoArchiveWrap: styled.div`
    padding: 50px;
    height: calc(100% - 74px);
  `,
  VideoTableContent: styled.div`
    height: 100%;
    padding: 70px 25px;
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.background2};
    border-radius: ${({ theme }) => theme.radius.large};

    select {
      padding: 8px 5px;
      border: 1px solid ${({ theme }) => theme.colors.lightGray3};
      border-radius: ${({ theme }) => theme.radius.small};
      cursor: pointer;
  `,
  DeleteBtn: styled.button`
    padding: 8px 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    border-radius: ${({ theme }) => theme.radius.xsmall};
  `,

  Table: styled.table`
    width: 100%;
    border-collapse: separate;
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    border: 1px solid ${({ theme }) => theme.colors.background2};
    border-radius: ${({ theme }) => theme.radius.medium};

    th,
    td {
      height: 50px;
      vertical-align: middle;
      text-align: center;
      padding: 10px 10px;
    }
  `,
  Thead: styled.thead`
    background-color: ${({ theme }) => theme.colors.background1};
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray1};
  `,
  Tbody: styled.tbody``,
  Badge: styled.span<{ $progress: boolean }>`
    padding: 4px 12px;
    font-size: ${({ theme }) => theme.fontSizes.fz12};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    border: 1.5px solid
      ${({ $progress, theme }) =>
        $progress ? theme.colors.darkGray2 : '#BFEABF'};
    background-color: ${({ $progress, theme }) =>
      $progress ? theme.colors.lightGray1 : '#e8faea'};
    color: ${({ $progress, theme }) =>
      $progress ? theme.colors.textSecond : '#32BA32'};
  `,
  DownloadBtn: styled.button`
    transition: all 0.3s ease-in-out;
    &:hover {
      opacity: 0.5;
    }
  `,
  LinkBtn: styled.button`
    padding: 8px 28px;
    border-radius: ${({ theme }) => theme.radius.small};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transition: all 0.3s ease-in-out;

    &:hover {
      opacity: 0.5;
    }
  `,
  PaginationWrapper: styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
  `,

  PaginationArrowBtn: styled.button`
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    color: ${({ theme }) => theme.colors.textSecond};
    transition: all 0.3s ease-in-out;

    svg {
      margin-bottom: 3px;
    }

    &:hover {
      opacity: 0.5;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,

  PaginationBtn: styled.button<{ isActive: boolean }>`
    padding: 8px;
    border-radius: ${({ theme }) => theme.radius.xsmall};
    background-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : theme.colors.white};
    color: ${({ isActive, theme }) =>
      isActive ? theme.colors.white : theme.colors.textSecond};
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      opacity: 0.8;
    }
  `,
  InputCheckbox: styled.input.attrs((props: { checked?: boolean }) => ({
    type: 'checkbox',
    checked: props.checked ?? false,
  }))`
    appearance: none;
    width: 20px;
    height: 20px;
    border: 1.5px solid ${({ theme }) => theme.colors.darkGray1};
    border-radius: 4px;
    background-color: ${({ checked, theme }) =>
      checked ? theme.colors.primary : theme.colors.white};
    cursor: pointer;
    z-index: 2;
    transition:
      background 0.2s,
      border-color 0.2s;

    &:checked {
      border: 1.5px solid ${({ theme }) => theme.colors.primary};
    }

    &:hover {
      opacity: 0.8;
    }
  `,
};
