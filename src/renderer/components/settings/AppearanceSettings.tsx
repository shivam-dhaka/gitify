import { webFrame } from 'electron';
import { type FC, useContext, useState } from 'react';

import {
  CheckIcon,
  CommentIcon,
  DashIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  MilestoneIcon,
  PaintbrushIcon,
  PlusIcon,
  TagIcon,
  XCircleIcon,
} from '@primer/octicons-react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Select,
  Stack,
  Text,
} from '@primer/react';

import { AppContext } from '../../context/App';
import { Size, Theme } from '../../types';
import { hasMultipleAccounts } from '../../utils/auth/utils';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../../utils/zoom';
import { Checkbox } from '../fields/Checkbox';
import { FieldLabel } from '../fields/FieldLabel';
import { Title } from '../primitives/Title';

let timeout: NodeJS.Timeout;
const DELAY = 200;

export const AppearanceSettings: FC = () => {
  const { auth, settings, updateSetting } = useContext(AppContext);
  const [zoomPercentage, setZoomPercentage] = useState(
    zoomLevelToPercentage(webFrame.getZoomLevel()),
  );

  window.addEventListener('resize', () => {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(() => {
      const zoomPercentage = zoomLevelToPercentage(webFrame.getZoomLevel());
      setZoomPercentage(zoomPercentage);
      updateSetting('zoomPercentage', zoomPercentage);
    }, DELAY);
  });

  return (
    <fieldset>
      <Title icon={PaintbrushIcon}>Appearance</Title>

      <Stack direction="vertical" gap="condensed">
        <Stack
          direction="horizontal"
          gap="condensed"
          align="center"
          className="text-sm"
        >
          <FieldLabel name="theme" label="Theme:" />
          <Select
            id="theme"
            value={settings.theme}
            onChange={(evt) =>
              updateSetting('theme', evt.target.value as Theme)
            }
            data-testid="settings-theme"
          >
            <Select.OptGroup label="System">
              <Select.Option value={Theme.SYSTEM}>System</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Light">
              <Select.Option value={Theme.LIGHT}>Light default</Select.Option>
              <Select.Option value={Theme.LIGHT_HIGH_CONTRAST}>
                Light high contrast
              </Select.Option>
              <Select.Option value={Theme.LIGHT_COLORBLIND}>
                Light Protanopia & Deuteranopia
              </Select.Option>
              <Select.Option value={Theme.LIGHT_TRITANOPIA}>
                Light Tritanopia
              </Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Dark">
              <Select.Option value={Theme.DARK}>Dark default</Select.Option>
              <Select.Option value={Theme.DARK_HIGH_CONTRAST}>
                Dark high contrast
              </Select.Option>
              <Select.Option value={Theme.DARK_COLORBLIND}>
                Dark Protanopia & Deuteranopia
              </Select.Option>
              <Select.Option value={Theme.DARK_TRITANOPIA}>
                Dark Tritanopia
              </Select.Option>
              <Select.Option value={Theme.DARK_DIMMED}>
                Dark dimmed
              </Select.Option>
            </Select.OptGroup>
          </Select>
        </Stack>

        <Stack
          direction="horizontal"
          gap="condensed"
          align="center"
          className="text-sm"
        >
          <FieldLabel name="zoom" label="Zoom:" />

          <ButtonGroup className="ml-2">
            <IconButton
              aria-label="Zoom out"
              size="small"
              icon={DashIcon}
              unsafeDisableTooltip={true}
              onClick={() =>
                zoomPercentage > 0 &&
                webFrame.setZoomLevel(
                  zoomPercentageToLevel(zoomPercentage - 10),
                )
              }
              data-testid="settings-zoom-out"
            />

            <Button aria-label="Zoom percentage" size="small" disabled>
              {zoomPercentage.toFixed(0)}%
            </Button>

            <IconButton
              aria-label="Zoom in"
              size="small"
              icon={PlusIcon}
              unsafeDisableTooltip={true}
              onClick={() =>
                zoomPercentage < 120 &&
                webFrame.setZoomLevel(
                  zoomPercentageToLevel(zoomPercentage + 10),
                )
              }
              data-testid="settings-zoom-in"
            />

            <IconButton
              aria-label="Reset zoom"
              size="small"
              variant="danger"
              icon={XCircleIcon}
              unsafeDisableTooltip={true}
              onClick={() => webFrame.setZoomLevel(0)}
              data-testid="settings-zoom-reset"
            />
          </ButtonGroup>
        </Stack>

        <Checkbox
          name="detailedNotifications"
          label="Detailed notifications"
          checked={settings.detailedNotifications}
          onChange={(evt) =>
            updateSetting('detailedNotifications', evt.target.checked)
          }
          tooltip={
            <Stack direction="vertical" gap="condensed">
              <Text>
                Enrich notifications with author or last commenter profile
                information, state and GitHub-like colors.
              </Text>
              <Text className="text-gitify-caution">
                ⚠️ Users with a large number of unread notifications <i>may</i>{' '}
                experience rate limiting under certain circumstances. Disable
                this setting if you experience this.
              </Text>
            </Stack>
          }
        />

        <Checkbox
          name="showPills"
          label="Show notification metric pills"
          checked={settings.showPills}
          onChange={(evt) => updateSetting('showPills', evt.target.checked)}
          tooltip={
            <Box>
              <Text>Show notification metric pills for:</Text>
              <Box className="pl-4">
                <ul>
                  <li className="flex items-center gap-1">
                    <IssueClosedIcon size={Size.SMALL} />
                    linked issues
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckIcon size={Size.SMALL} />
                    pr reviews
                  </li>
                  <li className="flex items-center gap-1">
                    <CommentIcon size={Size.SMALL} />
                    comments
                  </li>
                  <li className="flex items-center gap-1">
                    <TagIcon size={Size.SMALL} />
                    labels
                  </li>
                  <li className="flex items-center gap-1">
                    <MilestoneIcon size={Size.SMALL} />
                    milestones
                  </li>
                </ul>
              </Box>
            </Box>
          }
        />

        <Checkbox
          name="showNumber"
          label="Show number"
          checked={settings.detailedNotifications && settings.showNumber}
          onChange={(evt) =>
            settings.detailedNotifications &&
            updateSetting('showNumber', evt.target.checked)
          }
          disabled={!settings.detailedNotifications}
          tooltip={
            <Stack direction="vertical" gap="condensed">
              <Text>Show GitHub number for:</Text>
              <Box className="pl-4">
                <ul>
                  <li>
                    <Stack direction="horizontal" gap="condensed">
                      <CommentIcon size={Size.SMALL} />
                      Discussion
                    </Stack>
                  </li>
                  <li>
                    <Stack direction="horizontal" gap="condensed">
                      <IssueClosedIcon size={Size.SMALL} />
                      Issue
                    </Stack>
                  </li>
                  <li>
                    <Stack direction="horizontal" gap="condensed">
                      <GitPullRequestIcon size={Size.SMALL} />
                      Pull Request
                    </Stack>
                  </li>
                </ul>
              </Box>
              <Text className="text-gitify-caution">
                ⚠️ This setting requires{' '}
                <Text as="strong">Detailed Notifications</Text> to be enabled.
              </Text>
            </Stack>
          }
        />

        <Checkbox
          name="showAccountHeader"
          label="Show account header"
          checked={settings.showAccountHeader || hasMultipleAccounts(auth)}
          disabled={hasMultipleAccounts(auth)}
          onChange={(evt) =>
            updateSetting('showAccountHeader', evt.target.checked)
          }
        />

        <Checkbox
          name="wrapNotificationTitle"
          label="Show full notification title"
          checked={settings.wrapNotificationTitle}
          onChange={(evt) =>
            updateSetting('wrapNotificationTitle', evt.target.checked)
          }
          tooltip={
            <Text>
              Wrap long notification titles instead of truncating them.
            </Text>
          }
        />
      </Stack>
    </fieldset>
  );
};
