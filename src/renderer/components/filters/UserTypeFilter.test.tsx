import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import type { SettingsState } from '../../types';
import { UserTypeFilter } from './UserTypeFilter';

describe('renderer/components/filters/UserTypeFilter.tsx', () => {
  it('should render itself & its children', () => {
    const tree = render(
      <AppContext.Provider
        value={{
          settings: {
            ...mockSettings,
            detailedNotifications: true,
          } as SettingsState,
          notifications: mockAccountNotifications,
        }}
      >
        <MemoryRouter>
          <UserTypeFilter />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });
});
