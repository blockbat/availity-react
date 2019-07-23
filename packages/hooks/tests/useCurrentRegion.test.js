import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/react/cleanup-after-each';
import { avRegionsApi } from '@availity/api-axios';
import { useCurrentRegion } from '..';

jest.mock('@availity/api-axios');

avRegionsApi.getCurrentRegion.mockResolvedValue({
  config: { polling: false },
  data: {
    regions: [
      {
        id: 'FL',
        value: 'Florida',
      },
    ],
  },
  status: 200,
  statusText: 'Ok',
});

const Component = () => {
  const [region, loading] = useCurrentRegion();

  return loading ? <span data-testid="loading" /> : JSON.stringify(region);
};

describe('useCurrentRegion', () => {
  test('should return loading', () => {
    const { getByTestId } = render(<Component />);

    getByTestId('loading');
  });

  test('should return region', async () => {
    const { getByText } = render(<Component />);

    await waitForElement(() =>
      getByText(
        JSON.stringify({
          code: 'FL',
          value: 'Florida',
        })
      )
    );
  });
});
