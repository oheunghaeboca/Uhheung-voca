import styled from 'styled-components';

// 레벨 4탭 정의 — 'ALL' 은 클라이언트 필터 키. 백엔드에는 전달되지 않음
const LEVEL_TABS = [
  { key: 'ALL', label: '전체' },
  { key: 'BASIC', label: '기초' },
  { key: 'FREQUENT', label: '빈출' },
  { key: 'ADVANCED', label: '고급' },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Tab = styled.button`
  padding: 8px 14px;
  border: 1.5px solid ${({ $active }) => ($active ? '#F6841F' : '#F6D8B8')};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active }) => ($active ? '#F6841F' : '#FFF0DC')};
  color: ${({ $active }) => ($active ? '#fff' : '#B07040')};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;

  &:hover {
    transform: translateY(-1px);
    border-color: #F6841F;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #F6D8B8;
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fff;
  color: #2D1B0E;
  font-size: ${({ theme }) => theme.fontSize.sm};
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: #C9A98A; }
  &:focus {
    border-color: #F6841F;
    box-shadow: 0 0 0 3px rgba(246,132,31,0.18);
  }
`;

export default function WordFilterBar({ filters, onChange, levelCounts = {} }) {
  // 활성 레벨 — 미지정(또는 'ALL') 이면 전체 탭이 활성
  const activeLevel = filters?.level ?? 'ALL';

  const handleLevelClick = (key) => {
    // 'ALL' 은 level 키를 제거. 그 외엔 level 값으로 세팅
    const next = { ...(filters ?? {}) };
    if (key === 'ALL') delete next.level;
    else next.level = key;
    onChange?.(next);
  };

  return (
    <Wrapper>
      <Tabs role="tablist" aria-label="단어 레벨 필터">
        {LEVEL_TABS.map((tab) => {
          const count = tab.key === 'ALL' ? levelCounts.ALL : levelCounts[tab.key];
          const active = activeLevel === tab.key;
          return (
            <Tab
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              $active={active}
              onClick={() => handleLevelClick(tab.key)}
            >
              {tab.label}{typeof count === 'number' ? ` (${count})` : ''}
              {tab.key !== 'ALL' && (
                <span style={{ marginLeft: 4, opacity: 0.7, fontWeight: 500 }}>
                  {tab.key}
                </span>
              )}
            </Tab>
          );
        })}
      </Tabs>
      <SearchInput
        placeholder="단어 검색..."
        value={filters?.keyword ?? ''}
        onChange={(e) => onChange?.({ ...(filters ?? {}), keyword: e.target.value })}
      />
    </Wrapper>
  );
}
