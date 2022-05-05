import _ from 'the-lodash';
import React, { useState } from "react"
import { useService } from '@kubevious/ui-framework';
import { IBackendStatusService, BackendMetricItem } from '@kubevious/ui-middleware';

import cx from 'classnames';
import styles from './styles.module.css';

import VERSION from '../../version'

export const BackendMetrics = () => {

    const [backendMetrics, setBackendMetrics] = useState<BackendMetricItem[]>([]);

    useService<IBackendStatusService>({ kind: 'backend-status' }, 
        (svc) => {
            svc.getMetrics()
                .then(result => {
                    setBackendMetrics(result?.metrics ?? []);
                })
        });

    const metrics = _.concat([
        {
            category: 'Frontend',
            name: 'Version',
            value: VERSION
        }
    ], backendMetrics);

    const renderValue = (value: any) => {
        if (_.isBoolean(value)) {
            return value ? 'Yes' : 'No';
        }
        
        return (<>
            {value}
        </>);
    }

    return (
        <table className={cx("table table-striped table-dark", styles.table)}>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {metrics &&
                    metrics.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {[item.category, item.name].join(' :: ')}
                            </td>
                            <td>{renderValue(item.value)}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}
