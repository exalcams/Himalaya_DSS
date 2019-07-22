export class Data {
  public static widgets = {
    widget1: {
      conversion: {
        value: 70,
        ofTarget: 13
      },
      mainChart: [
        {
          name: 'Today',
          value: 70
        },
        {
          name: 'Inactive',
          value: 30
        }
      ]
    },
    widget2: {
      mainChart: [
        {
          name: 'This Week',
          value: 75
        },
        {
          name: 'Inactive',
          value: 25
        }
      ]
    },
    widget3: {
      mainChart: [
        {
          name: 'Last Week',
          value: 60
        },
        {
          name: 'Inactive',
          value: 40
        }
      ]
    },
    widget4: {
      impressions: {
        value: '34',
        ofTarget: 12
      },
      title: 'Github Issue',
      ranges: {
        TW: 'This Week',
        LW: 'Last Week',
        '2W': '2 Weeks Ago'
      },
      mainChart: {
        TW: [
          {
            name: 'Mon',
            series: [
              {
                name: 'Active',
                value: 80
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          },
          {
            name: 'Tue',
            series: [
              {
                name: 'Active',
                value: 90
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Wed',
            series: [
              {
                name: 'Active',
                value: 76
              },
              {
                name: 'Inactive',
                value: 20
              }
            ]
          },
          {
            name: 'Thu',
            series: [
              {
                name: 'Active',
                value: 56
              },
              {
                name: 'Inactive',
                value: 40
              }
            ]
          },
          {
            name: 'Fri',
            series: [
              {
                name: 'Active',
                value: 86
              },
              {
                name: 'Inactive',
                value: 10
              }
            ]
          },
          {
            name: 'Sat',
            series: [
              {
                name: 'Active',
                value: 48
              },
              {
                name: 'Inactive',
                value: 48
              }
            ]
          },
          {
            name: 'Sun',
            series: [
              {
                name: 'Active',
                value: 24
              },
              {
                name: 'Inactive',
                value: 72
              }
            ]
          }
        ]
      }
    },
    widget5: {
      conversion: {
        value: 70,
        ofTarget: 13
      },
      mainChart: {
        TW: [
          {
            name: 'Mon',
            series: [
              {
                name: 'Active',
                value: 80
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          },
          {
            name: 'Tue',
            series: [
              {
                name: 'Active',
                value: 90
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Wed',
            series: [
              {
                name: 'Active',
                value: 76
              },
              {
                name: 'Inactive',
                value: 20
              }
            ]
          },
          {
            name: 'Thu',
            series: [
              {
                name: 'Active',
                value: 56
              },
              {
                name: 'Inactive',
                value: 40
              }
            ]
          },
          {
            name: 'Fri',
            series: [
              {
                name: 'Active',
                value: 86
              },
              {
                name: 'Inactive',
                value: 10
              }
            ]
          },
          {
            name: 'Sat',
            series: [
              {
                name: 'Active',
                value: 48
              },
              {
                name: 'Inactive',
                value: 48
              }
            ]
          },
          {
            name: 'Sun',
            series: [
              {
                name: 'Active',
                value: 24
              },
              {
                name: 'Inactive',
                value: 72
              }
            ]
          }
        ]
      }
    },
    widget6: {
      conversion: {
        value: 70,
        ofTarget: 13
      },
      chartType: 'line',
      datasets: [
        {
          label: 'Exceptions',
          data: [15, 14, 34, 25, 19, 12, 30],
          fill: false
        }
      ],
      labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7'],
      colors: [
        {
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: ['#000000']
        }
      ],
      options: {
        spanGaps: false,
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 2,
            borderWidth: 1,
            hoverRadius: 2,
            hoverBorderWidth: 1
          },
          line: {
            tension: 0
          }
        },
        layout: {
          padding: {
            top: 24,
            left: 16,
            right: 16,
            bottom: 16
          }
        },
        scales: {
          xAxes: [
            {
              display: false
            }
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                // min: 100,
                // max: 500
              }
            }
          ]
        }
      }
    },
    widget7: {
      title: 'Electro-Plating Activity',
      ranges: {
        TW: 'This Week',
        LW: 'Last Week',
        '2W': 'Last Month'
      },
      mainChart: {
        '2W': [
          {
            name: 'Mon',
            series: [
              {
                name: 'Active',
                value: 18
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Tue',
            series: [
              {
                name: 'Active',
                value: 17
              },
              {
                name: 'Inactive',
                value: 7
              }
            ]
          },
          {
            name: 'Wed',
            series: [
              {
                name: 'Active',
                value: 20
              },
              {
                name: 'Inactive',
                value: 4
              }
            ]
          },
          {
            name: 'Thu',
            series: [
              {
                name: 'Active',
                value: 16
              },
              {
                name: 'Inactive',
                value: 8
              }
            ]
          },
          {
            name: 'Fri',
            series: [
              {
                name: 'Active',
                value: 18
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Sat',
            series: [
              {
                name: 'Active',
                value: 8
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          },
          {
            name: 'Sun',
            series: [
              {
                name: 'Active',
                value: 8
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          }
        ],
        LW: [
          {
            name: 'Mon',
            series: [
              {
                name: 'Active',
                value: 18
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Tue',
            series: [
              {
                name: 'Active',
                value: 17
              },
              {
                name: 'Inactive',
                value: 7
              }
            ]
          },
          {
            name: 'Wed',
            series: [
              {
                name: 'Active',
                value: 20
              },
              {
                name: 'Inactive',
                value: 4
              }
            ]
          },
          {
            name: 'Thu',
            series: [
              {
                name: 'Active',
                value: 16
              },
              {
                name: 'Inactive',
                value: 8
              }
            ]
          },
          {
            name: 'Fri',
            series: [
              {
                name: 'Active',
                value: 18
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Sat',
            series: [
              {
                name: 'Active',
                value: 8
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          },
          {
            name: 'Sun',
            series: [
              {
                name: 'Active',
                value: 8
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          }
        ],
        TW: [
          {
            name: 'Mon',
            series: [
              {
                name: 'Active',
                value: 18
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Tue',
            series: [
              {
                name: 'Active',
                value: 17
              },
              {
                name: 'Inactive',
                value: 7
              }
            ]
          },
          {
            name: 'Wed',
            series: [
              {
                name: 'Active',
                value: 20
              },
              {
                name: 'Inactive',
                value: 4
              }
            ]
          },
          {
            name: 'Thu',
            series: [
              {
                name: 'Active',
                value: 16
              },
              {
                name: 'Inactive',
                value: 8
              }
            ]
          },
          {
            name: 'Fri',
            series: [
              {
                name: 'Active',
                value: 18
              },
              {
                name: 'Inactive',
                value: 6
              }
            ]
          },
          {
            name: 'Sat',
            series: [
              {
                name: 'Active',
                value: 8
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          },
          {
            name: 'Sun',
            series: [
              {
                name: 'Active',
                value: 8
              },
              {
                name: 'Inactive',
                value: 16
              }
            ]
          }
        ]
      },
      supporting: {
        created: {
          label: 'Barriers',
          count: {
            '2W': 48,
            LW: 46,
            TW: 54
          },
          chart: {
            '2W': [
              {
                name: 'Barriers',
                series: [
                  {
                    name: 'Mon',
                    value: 5
                  },
                  {
                    name: 'Tue',
                    value: 8
                  },
                  {
                    name: 'Wed',
                    value: 5
                  },
                  {
                    name: 'Thu',
                    value: 6
                  },
                  {
                    name: 'Fri',
                    value: 7
                  },
                  {
                    name: 'Sat',
                    value: 8
                  },
                  {
                    name: 'Sun',
                    value: 7
                  }
                ]
              }
            ],
            LW: [
              {
                name: 'Barriers',
                series: [
                  {
                    name: 'Mon',
                    value: 5
                  },
                  {
                    name: 'Tue',
                    value: 8
                  },
                  {
                    name: 'Wed',
                    value: 5
                  },
                  {
                    name: 'Thu',
                    value: 6
                  },
                  {
                    name: 'Fri',
                    value: 7
                  },
                  {
                    name: 'Sat',
                    value: 8
                  },
                  {
                    name: 'Sun',
                    value: 7
                  }
                ]
              }
            ],
            TW: [
              {
                name: 'Barriers',
                series: [
                  {
                    name: 'Mon',
                    value: 5
                  },
                  {
                    name: 'Tue',
                    value: 8
                  },
                  {
                    name: 'Wed',
                    value: 5
                  },
                  {
                    name: 'Thu',
                    value: 6
                  },
                  {
                    name: 'Fri',
                    value: 7
                  },
                  {
                    name: 'Sat',
                    value: 8
                  },
                  {
                    name: 'Sun',
                    value: 7
                  }
                ]
              }
            ]
          }
        },
        closed: {
          label: 'Taking',
          count: {
            '2W': 27,
            LW: 31,
            TW: 26
          },
          chart: {
            '2W': [
              {
                name: 'Taking',
                series: [
                  {
                    name: 'Mon',
                    value: 3
                  },
                  {
                    name: 'Tue',
                    value: 2
                  },
                  {
                    name: 'Wed',
                    value: 1
                  },
                  {
                    name: 'Thu',
                    value: 4
                  },
                  {
                    name: 'Fri',
                    value: 8
                  },
                  {
                    name: 'Sat',
                    value: 8
                  },
                  {
                    name: 'Sun',
                    value: 4
                  }
                ]
              }
            ],
            LW: [
              {
                name: 'Taking',
                series: [
                  {
                    name: 'Mon',
                    value: 3
                  },
                  {
                    name: 'Tue',
                    value: 2
                  },
                  {
                    name: 'Wed',
                    value: 1
                  },
                  {
                    name: 'Thu',
                    value: 4
                  },
                  {
                    name: 'Fri',
                    value: 8
                  },
                  {
                    name: 'Sat',
                    value: 8
                  },
                  {
                    name: 'Sun',
                    value: 4
                  }
                ]
              }
            ],
            TW: [
              {
                name: 'Taking',
                series: [
                  {
                    name: 'Mon',
                    value: 3
                  },
                  {
                    name: 'Tue',
                    value: 2
                  },
                  {
                    name: 'Wed',
                    value: 1
                  },
                  {
                    name: 'Thu',
                    value: 4
                  },
                  {
                    name: 'Fri',
                    value: 8
                  },
                  {
                    name: 'Sat',
                    value: 8
                  },
                  {
                    name: 'Sun',
                    value: 4
                  }
                ]
              }
            ]
          }
        },
        reOpened: {
          label: 'Issues',
          count: {
            '2W': 4,
            LW: 5,
            TW: 2
          },
          chart: {
            '2W': [
              {
                name: 'Issues',
                series: [
                  {
                    name: 'Mon',
                    value: 6
                  },
                  {
                    name: 'Tue',
                    value: 3
                  },
                  {
                    name: 'Wed',
                    value: 7
                  },
                  {
                    name: 'Thu',
                    value: 5
                  },
                  {
                    name: 'Fri',
                    value: 5
                  },
                  {
                    name: 'Sat',
                    value: 4
                  },
                  {
                    name: 'Sun',
                    value: 7
                  }
                ]
              }
            ],
            LW: [
              {
                name: 'Issues',
                series: [
                  {
                    name: 'Mon',
                    value: 6
                  },
                  {
                    name: 'Tue',
                    value: 3
                  },
                  {
                    name: 'Wed',
                    value: 7
                  },
                  {
                    name: 'Thu',
                    value: 5
                  },
                  {
                    name: 'Fri',
                    value: 5
                  },
                  {
                    name: 'Sat',
                    value: 4
                  },
                  {
                    name: 'Sun',
                    value: 7
                  }
                ]
              }
            ],
            TW: [
              {
                name: 'Issues',
                series: [
                  {
                    name: 'Mon',
                    value: 6
                  },
                  {
                    name: 'Tue',
                    value: 3
                  },
                  {
                    name: 'Wed',
                    value: 7
                  },
                  {
                    name: 'Thu',
                    value: 5
                  },
                  {
                    name: 'Fri',
                    value: 5
                  },
                  {
                    name: 'Sat',
                    value: 4
                  },
                  {
                    name: 'Sun',
                    value: 7
                  }
                ]
              }
            ]
          }
        }
      }
    },
    widget8: {
      multi: [
        {
          name: '0 - 6',
          series: [
            {
              name: 'Monday',
              value: 85
            },
            {
              name: 'Tuesday',
              value: 78
            },
            {
              name: 'Wednesday',
              value: 76
            },
            {
              name: 'Thursday',
              value: 65
            },
            {
              name: 'Friday',
              value: 85
            },
            {
              name: 'Saturday',
              value: 80
            },
            {
              name: 'Sunday',
              value: 70
            }
          ]
        },
        {
          name: '6 - 12',
          series: [
            {
              name: 'Monday',
              value: 85
            },
            {
              name: 'Tuesday',
              value: 85
            },
            {
              name: 'Wednesday',
              value: 85
            },
            {
              name: 'Thursday',
              value: 85
            },
            {
              name: 'Friday',
              value: 85
            },
            {
              name: 'Saturday',
              value: 85
            },
            {
              name: 'Sunday',
              value: 85
            }
          ]
        },
        {
          name: '12-18',
          series: [
            {
              name: 'Monday',
              value: 85
            },
            {
              name: 'Tuesday',
              value: 85
            },
            {
              name: 'Wednesday',
              value: 85
            },
            {
              name: 'Thursday',
              value: 85
            },
            {
              name: 'Friday',
              value: 85
            },
            {
              name: 'Saturday',
              value: 85
            },
            {
              name: 'Sunday',
              value: 85
            }
          ]
        },
        {
          name: '18-00',
          series: [
            {
              name: 'Monday',
              value: 85
            },
            {
              name: 'Tuesday',
              value: 85
            },
            {
              name: 'Wednesday',
              value: 85
            },
            {
              name: 'Thursday',
              value: 85
            },
            {
              name: 'Friday',
              value: 85
            },
            {
              name: 'Saturday',
              value: 85
            },
            {
              name: 'Sunday',
              value: 85
            }
          ]
        }
      ]
    },
    widget9: {
      title: 'Device Active Hours',
      table: {
        columns: [
          {
            title: 'Device Id'
          },
          {
            title: 'Device Type'
          },
          {
            title: 'Today'
          },
          {
            title: 'Yesterday'
          },
          {
            title: 'Last Week'
          },
          {
            title: 'Last Month'
          }
        ],
        rows: [
          [
            {
              value: 'H91',
              classes: 'primary',
              icon: ''
            },
            {
              value: 'Barrier',
              classes: 'text-bold',
              icon: ''
            },
            {
              value: '6',
              classes: '',
              icon: ''
            },
            {
              value: '8',
              classes: '',
              icon: ''
            },
            {
              value: '8',
              classes: '',
              icon: ''
            },
            {
              value: '9',
              classes: '',
              icon: ''
            }
          ],
          [
            {
              value: 'H91',
              classes: 'primary',
              icon: ''
            },
            {
              value: 'Taking',
              classes: 'text-bold',
              icon: ''
            },
            {
              value: '8',
              classes: '',
              icon: ''
            },
            {
              value: '10',
              classes: '',
              icon: ''
            },
            {
              value: '10',
              classes: '',
              icon: ''
            },
            {
              value: '10',
              classes: '',
              icon: ''
            }
          ],
          [
            {
              value: 'H92',
              classes: 'primary',
              icon: ''
            },
            {
              value: 'Barrier',
              classes: 'text-bold',
              icon: ''
            },
            {
              value: '6',
              classes: '',
              icon: ''
            },
            {
              value: '9',
              classes: '',
              icon: ''
            },
            {
              value: '9',
              classes: '',
              icon: ''
            },
            {
              value: '8',
              classes: '',
              icon: ''
            }
          ],
          [
            {
              value: 'H94',
              classes: 'primary',
              icon: ''
            },
            {
              value: 'Taking',
              classes: 'text-bold',
              icon: ''
            },
            {
              value: '7',
              classes: '',
              icon: ''
            },
            {
              value: '8',
              classes: '',
              icon: ''
            },
            {
              value: '9',
              classes: '',
              icon: ''
            },
            {
              value: '10',
              classes: '',
              icon: ''
            }
          ],
          [
            {
              value: 'H92',
              classes: 'primary',
              icon: ''
            },
            {
              value: 'Barrier',
              classes: 'text-bold',
              icon: ''
            },
            {
              value: '10',
              classes: '',
              icon: ''
            },
            {
              value: '8',
              classes: '',
              icon: ''
            },
            {
              value: '13',
              classes: '',
              icon: ''
            },
            {
              value: '15',
              classes: '',
              icon: ''
            }
          ]
        ]
      }
    }
  };
}
