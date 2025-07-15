import { InstantTaskConvertService } from '../../../src/services/InstantTaskConvertService';
import { PluginFactory } from '../../helpers/mock-factories';
import { TFile } from '../../__mocks__/obsidian';

jest.mock('../../../src/utils/helpers', () => {
  const actual = jest.requireActual('../../../tests/__mocks__/utils');
  return {
    ...actual,
    filterEmptyProjects: jest.requireActual('../../../src/utils/helpers').filterEmptyProjects
  };
});

jest.mock('../../../src/utils/dateUtils', () => require('../../__mocks__/utils'));

describe('InstantTaskConvertService', () => {
  it('should include projects from parsed data when creating task', async () => {
    const mockPlugin = PluginFactory.createMockPlugin();
    mockPlugin.settings.useDefaultsOnInstantConvert = false;
    const service = new InstantTaskConvertService(
      mockPlugin,
      mockPlugin.statusManager,
      mockPlugin.priorityManager
    );

    const parsedData: any = {
      title: 'Test Task',
      projects: ['[[Project One]]', 'Second Project']
    };

    (mockPlugin.taskService.createTask as jest.Mock).mockResolvedValue({ file: new TFile('Tasks/test.md') });

    const file = await (service as any).createTaskFile(parsedData, '');

    expect(mockPlugin.taskService.createTask).toHaveBeenCalledWith(
      expect.objectContaining({ projects: ['[[Project One]]', 'Second Project'] })
    );
    expect(file).toBeInstanceOf(TFile);
  });
});
