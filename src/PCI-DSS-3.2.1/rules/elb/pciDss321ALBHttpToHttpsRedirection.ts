/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

import { CfnListener } from '@aws-cdk/aws-elasticloadbalancingv2';
import { CfnResource, Stack } from '@aws-cdk/core';
import { resolveIfPrimitive } from '../../../nag-pack';

/**
 * ALB HTTP listeners are configured to redirect to HTTPS - (Control IDs: 2.3, 4.1, 8.2.1)
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnListener) {
    let found = false;
    const protocol = resolveIfPrimitive(node, node.protocol);
    const actions = Stack.of(node).resolve(node.defaultActions);

    if (protocol == 'HTTP') {
      for (const action of actions) {
        if (
          action.type == 'redirect' &&
          action.redirectConfig.protocol == 'HTTPS'
        ) {
          found = true;
        }
      }
      if (!found) return false;
    }
  }

  return true;
}
