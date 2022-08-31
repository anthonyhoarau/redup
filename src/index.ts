import { Command } from 'commander'
import commandCreateReview from './commands/command-create-review'
import { envConfig } from './config/env-config'
import { mandatoryCheckBeforeAnyCommand } from './common/hooks/mandatory-check'

export function run (): void {
  const program = new Command()

  program
    .name('redup')
    .description('CLI to update issue on Redmine and Upsource')
    .version('0.0.1')
    .hook('preAction', envConfig)
    .hook('preAction', mandatoryCheckBeforeAnyCommand)

  program.addCommand(commandCreateReview())

  program.parse()
}
