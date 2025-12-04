import type { Submission } from '@solidjs/router'
import type { User } from '../types'

// const sub: SubmissionStub | Submission<[formData: FormData], User[] | Error>
// type userSub = SubmissionStub | Submission<[formData: FormData], User[] | Error>
type UserSub = Submission<[formData: FormData], User[] | Error>
export function logTable(sub: UserSub) {
  const resultInputs = [
    ['result', sub.result],
    ['typeof', typeof sub.result],
    ['instanceof Error', sub.result instanceof Error ? 'true' : 'false'],
  ]
  console.group('sub.result')
  console.table(resultInputs)
  console.groupEnd()

  const errorInputs = [
    ['error', sub.error],
    ['typeof', typeof sub.error],
    ['instanceof Error', sub.error instanceof Error ? 'true' : 'false'],
  ]
  console.group('sub.error')
  console.table(errorInputs)
  console.groupEnd()
}

/*
  const tblResult = () => {
    const inputs = [
      ["result", sub.result],
      ["typeof", typeof sub.result],
      ["instanceof Error", sub.error instanceof Error ? "true" : "false"],
    ];
    console.group("sub.result");
    console.table(inputs);
    console.groupEnd();
  };

  const tblError = () => {
    const inputs = [
      ["error", sub.error],
      ["typeof", typeof sub.error],
      ["instanceof Error", sub.error instanceof Error ? "true" : "false"],
    ];
    console.group("sub.error");
    console.table(inputs);
    console.groupEnd();
  };
*/
