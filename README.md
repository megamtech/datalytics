# Datalytics

[[_TOC_]]

# Registry setup
**npm command**
```shell
echo @megamtech-labs:registry=https://labs.megamtech.com/api/v4/packages/npm/ >> .npmrc
```
yarn command
```shell
echo \"@megamtech-labs:registry\" \"https://labs.megamtech.com/api/v4/packages/npm/\" >> .yarnrc
```
# Installation
   **npm command**
```shell
npm i @megamtech-labs/datalytics
```
**yarn command**
```shell
yarn add @megamtech-labs/datalytics
```
# Usage
## Grid
```html
<datalytics-tabular-report 
[data]="tableList" 
[pageSize]="pagination.pageSize" 
[columns]="tableColumns"
(pageChange)="pageChange($event)" 
(sortChange)="applySort($event)">
</datalytics-tabular-report>
```

**Input**
| Name | Type |Default|Description
| ------ | ------ | ------ | ------ |
| data | {[key:string]:any}[] | NA| cell |
| columns | Column[] | NA | cell |
| pageSize | number | 25 | cell |

**Output**
| Name | Param |Description
| ------ | ------ | ------ 
| pageChange | cell | cell 
| sortChange | cell | cell 


## Charts
```html
<datalytics-charts 
[data]="data" 
[chartAxis]="chartAxis"
[chartOptions]="{legend:true,animation:true,title:'D1',xaxis:'D2'}">
</datalytics-charts>
```

**Input**
| Name | Type |Default|Description
| ------ | ------ | ------ | ------ |
| data | {[key:string]:any}[] | NA| cell |
| chartAxis | cell | cell | cell |
| chartOptions | cell | cell | cell |

**Output**
| Name | Param |Description
| ------ | ------ | ------ 
| pageChange | cell | cell 
| sortChange | cell | cell 


## Filters
```html
<datalytics-report-filters 
(getFilterData)="search($event)" 
[dynamicFilterData]="dynamicFilterData"
[filters]="tableColumns" 
[name]="'Tabular Report'">
</datalytics-report-filters>
```
**Input**
| Name | Type |Default|Description
| ------ | ------ | ------ | ------ |
| filters | Column[] | cell | cell |
| name | string | cell | cell |
| dynamicFilterData | cell | cell | cell |

**Output**
| Name | Type |Default|Description
| ------ | ------ | ------ | ------ |
| getFilterData | Filter[] | cell | cell |


